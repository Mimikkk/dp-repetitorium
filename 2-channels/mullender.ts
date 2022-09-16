import { addListeners, deliver, Frame, Message, Receive, Send, send } from "../definitions";

// Warstwa monitorów, która gwarantuje fifo dla każdego procesu,
// bez gwarancji fifo od kanałów.

// @ts-ignore
class Packet implements Frame {
  sequenceNo: number;
  message: Message;
  isDeliverable = (from: Monitor, to: Monitor) =>
    this.sequenceNo === to.process.deliveredNos[from.process.id] + 1;
}

interface Process {
  id: number;
  sequenceNos: number[];
  deliveredNos: number[];
  delayed: Set<Packet>;
  monitor: Monitor;
}
interface Monitor {
  process: Process;
}

addListeners([
  [Send, (sender: Process, destination: Process, message: Message) =>
    send(sender.monitor, destination.monitor, { sequenceNo: ++sender.sequenceNos[destination.id], message })
  ],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    if (!packet.isDeliverable(sender, destination)) {
      destination.process.delayed.add(packet);
      return;
    }

    deliver(sender.process, destination.process, packet);
    let delivered;
    do {
      delivered = false;

      for (const packet of destination.process.delayed) {
        if (packet.isDeliverable(sender, destination)) {
          ++destination.process.deliveredNos[sender.process.id];
          deliver(sender.process, destination.process, packet);
          destination.process.delayed.delete(packet);
          delivered = true;
        }
      }
    } while (delivered);
  }],
]);
