import { addListeners, deliver, Frame, Internal, VectorClock, Message, Receive, Send, send } from "../definitions";

interface Packet extends Frame {
  clock: VectorClock;
  message: Message,
}
interface Process {
  id: number;
  clock: VectorClock;
  monitor: Monitor;
}
interface Monitor {
  process: Process;
}

addListeners([
  [Internal, (self: Process) => self.clock.tickAt(self.id)],
  [Send, (sender: Process, destination: Process, message: Message) => {
    sender.clock.tickAt(sender.id);
    send(sender.monitor, destination.monitor, { clock: sender.clock, message });
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    destination.process.clock.tickAt(destination.process.id);
    destination.process.clock.sync(packet.clock);
    deliver(sender.process, destination.process, packet.message);
  }],
]);
