import { addListeners, deliver, Frame, Message, Receive, Send, send, Start, uuid } from "../definitions";
import { omit } from "../utils";
import { processes } from "../globals";


enum Colour { White, Red }
interface Packet extends Frame {
  colour: Colour;
  message: Message;
}

type ChannelState<T extends "in" | "out" = "in" | "out"> = Set<Message> & {
  out: ChannelState<"out">[];
  in: ChannelState<"in">[];
} & (T extends "in" ? {
  direction: Process;
} : {
  source: Process;
})

interface State {
  process: Process.State;
  channels: ChannelState[];
}
interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;
  state: Process.State;
  channels: {
    in: ChannelState<"in">[];
    out: ChannelState<"out">[];
  } & ChannelState[];
  colour: Colour;
  initializer: null | Monitor;
}
module Process { export interface State {} }

addListeners([
  [Start, <TakeSnapshot>(initializer: Monitor) => {
    initializer.process.state = initializer.process.state;
    initializer.process.colour = Colour.Red;
    send(initializer, omit(processes, initializer), { colour: Colour.Red });
  }],
  [Send, (sender: Process, destination: Process, message: Message) =>
    send(sender.monitor, destination.monitor, { colour: sender.colour, message }),
  ],
  [Receive, (initializer: Monitor, destination: Monitor, packet: Packet) => {
    if (packet.colour === Colour.White && destination.process.colour === Colour.Red) {
      send(destination, initializer, { channels: packet.message });
    }

    if (packet.colour === Colour.Red && destination.process.colour === Colour.White) {
      destination.process.colour = Colour.Red;
      send(destination, initializer, { process: destination.process.state });
    }

    if (packet.message) {
      deliver(initializer.process, destination.process, packet.message);
    }
  }],
]);
