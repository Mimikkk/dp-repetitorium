import { addListeners, deliver, Frame, Message, Receive, Send, send, Start, uuid } from "../definitions";
import { omit } from "../utils";
import { processes } from "../globals";
interface Packet extends Frame {
  state: State;
  message: Message;
  colour: Colour;
}

enum Colour { White, Red }
interface ProcessState {}

interface State {
  process: ProcessState;
  messages: {
    sent: Set<Message>;
    recv: Set<Message>;
  };
}
const send_ = send;
module State {
  export const record = (monitor: Monitor) => {
    monitor.process.state = monitor.process.state;
    monitor.process.messages.sent = monitor.process.messages.out;
    monitor.process.messages.recv = monitor.process.messages.in;
  };

  export const send = (initializer: Monitor, other: Monitor) => {
    send_(other, initializer, {
      process: other.process.state,
      messages: {
        sent: other.process.messages.sent,
        recv: other.process.messages.recv,
      },
    } as State);
  };
}

interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;
  colour: Colour;
  state: Process.State;
  messages: {
    sent: Set<Message>;
    recv: Set<Message>;
    in: Set<Message>;
    out: Set<Message>;
  };
}
module Process { export interface State {} }

addListeners([
  [Start, <TakeSnapshot>(initializer: Monitor) => {
    State.record(initializer);
    initializer.process.colour = Colour.Red;
    send(initializer, omit(processes, initializer), { colour: Colour.Red });
    State.send(initializer, initializer);
  }],
  [Send, (sender: Process, destination: Process, message: Message) => {
    sender.messages.out.add(message);
    send(sender.monitor, destination.monitor, { colour: sender.colour, message });
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    if (packet.colour === Colour.Red && destination.process.colour === Colour.White) {
      destination.process.colour = Colour.Red;
      State.send(sender, destination);
    }
    if (packet.message) {
      destination.process.messages.in.add(packet.message);
      deliver(sender.process, destination.process, packet.message);
    }
  }],
]);
