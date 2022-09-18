import { addListeners, deliver, Message, Receive, Send, send, uuid, VectorClock } from "../definitions";
import { omit } from "../utils";

// Gwarancja kolejności dostarczenia wiadomości w sieciach monitorów bez potrzeby rozgłaszania

interface Packet {
  clock: VectorClock;
  memory: Record<uuid, VectorClock>;
  message: Message;
}
module Packet {
  export const isDeliverable = (
    sender: Process,
    destination: Process,
    packet: Packet,
  ) =>
    !!packet.memory?.[destination.id].isNotEarlierOrSameAs(destination.clock);
}

interface Process {
  memory: Record<uuid, VectorClock>;
  delayed: Set<Packet>;
  timestamps: number[];
  clock: VectorClock;
  id: number;
  monitor: Monitor;
}
interface Monitor {
  process: Process;
}

addListeners([
  [Send, (sender: Process, destination: Process, message: Message) => {
    sender.clock.tickAt(sender.id);
    send(sender.monitor, destination.monitor, {
      clocks: sender.clock,
      memory: sender.memory,
      message,
    });
    sender.memory[destination.id] = sender.clock;
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    if (!Packet.isDeliverable(sender.process, destination.process, packet)) {
      sender.process.delayed.add(packet);
      return;
    }
    for (const [id, clock] of Object.entries(omit(packet.memory, destination.process.id))) {
      destination.process.memory[id]?.sync(clock);
      destination.process.memory[id] = clock;
    }
    destination.process.clock.sync(packet.clock);

    deliver(sender.process, destination.process, packet.message);
    let deliverable = true;
    while (deliverable) {
      deliverable = false;

      for (const packet of sender.process.delayed) {
        if (!Packet.isDeliverable(sender.process, destination.process, packet)) continue;
        for (const [id, clock] of Object.entries(omit(packet.memory, destination.process.id))) {
          destination.process.memory[id]?.sync(clock);
          destination.process.memory[id] = clock;
        }
        destination.process.clock.sync(packet.clock);

        deliver(sender.process, destination.process, packet.message);
        deliverable = true;
        sender.process.delayed.delete(packet);
      }
    }
  }],
]);
