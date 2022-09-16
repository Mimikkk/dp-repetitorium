import { addListeners, deliver, Frame, Internal, Message, Receive, ScalarClock, Send, send } from "../definitions";

interface Packet extends Frame {
  clock: ScalarClock;
  message: Message,
}
interface Process {
  clock: ScalarClock;
  monitor: Monitor;
}
interface Monitor {
  process: Process;
}

addListeners([
  [Internal, (self: Process) => self.clock.tick()],
  [Send, (sender: Process, destination: Process, message: Message) =>
    send(sender.monitor, destination.monitor, { clock: sender.clock.tick(), message }),
  ],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    destination.process.clock.sync(packet.clock);
    deliver(sender.process, destination.process, packet);
  }],
]);
