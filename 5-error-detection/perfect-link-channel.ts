import { addListeners, deliverPL, DeliverStubborn, Frame, Message, SendPerfectLink, sendSB } from "../definitions";

interface Packet extends Frame {
  origin: Process;
  message: Message;
}
interface Process {
  id: number;
  monitor: Monitor;
  delivered: Set<Message>;
}
interface Monitor {
  process: Process;
}

addListeners([
  [SendPerfectLink, async (sender: Process, destination: Process, message: Message) => {
    sendSB(sender.monitor, destination.monitor, { message });
  }],
  [DeliverStubborn, (sender: Monitor, destination: Monitor, packet: Packet) => {
    if (destination.process.delivered.has(packet.message)) return;

    destination.process.delivered.add(packet.message);
    deliverPL(sender, destination, packet.message);
  }],
]);
