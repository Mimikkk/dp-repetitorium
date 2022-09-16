import { addListeners, deliver, Message, Receive, Send, send, uuid } from "../definitions";

// Gwarancja kolejności dostarczenia wiadomości w sieciach monitorów bez potrzeby rozgłaszania

interface Packet {
  clocks: number[];
  memory: Set<Record<uuid, number[]>>;
  message: Message;
}
module Packet {
  export const omit = (packet: Packet, except: Process) => {
    const memory: Set<Record<uuid, number[]>> = { ...packet.memory };
    delete memory[except.id];
    return memory;
  };

  export const isDeliverable = (
    sender: Process,
    destination: Process,
    packet: Packet,
  ) =>
    (packet.memory[sender.id] === undefined) ||
    !Object.values(omit(packet, sender))
           .some((timestamps) =>
             timestamps.some((timestamp, i) => timestamp > sender.timestamps[i]),
           );

}

interface Process {
  memory: Set<Record<uuid, number[]>>;
  delayed: Set<Packet>;
  timestamps: number[];
  clocks: number[];
  id: number;
  monitor: Monitor;
}
interface Monitor {
  process: Process;
}

addListeners([
  [Send, (sender: Process, destination: Process, message: Message) => {
    ++sender.clocks[sender.id];
    send(sender.monitor, destination.monitor, {
      clocks: sender.clocks,
      memory: sender.memory,
      message,
    });
    sender.memory[destination.id] = sender.clocks;
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    let deliverable = Packet.isDeliverable(sender.process, destination.process, packet);
    if (!deliverable) {
      sender.process.delayed.add(packet);
      return;
    }
    deliver(sender.process, destination.process, packet.message);
    for (const [id, timestamps] of Object.entries(Packet.omit(packet, sender.process))) {
      // TODO - got bored
    }

    while (deliverable) {
      deliverable = false;

      for (const packet of sender.process.delayed) {
        deliverable = Packet.isDeliverable(sender.process, destination.process, packet);
        if (!deliverable) continue;

        sender.process.delayed.delete(packet);
        deliver(sender.process, destination.process, packet.message);
      }
    }
  }],
]);