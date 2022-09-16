import { addListeners, decide, deliver, Frame, Message, Receive, Send, send, Start, uuid } from "../definitions";
import { waitfor } from "../utils";

enum Colour { White, Black }
interface Packet extends Frame {
  message: Message;
}
interface Token extends Frame {
  colour: Colour;
}

interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;
  hasToken: boolean;
  colour: Colour;
  successor: Monitor;
  passive: boolean;
  isInitializer: boolean;
}

const initializeTerminationDetection = (initializer: Monitor) => {
  initializer.process.hasToken = false;
  initializer.process.colour = Colour.White;
  initializer.process.isInitializer = true;
  send(initializer, initializer.process.successor, { colour: Colour.White });
};

addListeners([
  [Start, async <TerminationDetection>(initializer: Monitor) => {
    await waitfor(() => initializer.process.passive);
    initializeTerminationDetection(initializer);
  }],
  [Send, (sender: Process, destination: Process, message: Message) => {
    if (sender.id < destination.id) sender.colour = Colour.Black;
    send(sender.monitor, destination.monitor, { message });
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) =>
    deliver(sender.process, destination.process, packet),
  ],
  [Receive, async (predecessor: Monitor, destination: Monitor, token: Token) => {
    destination.process.hasToken = true;
    await waitfor(() => destination.process.passive);

    if (destination.process.isInitializer) {
      if (destination.process.colour === Colour.White && token.colour === Colour.White) {
        decide(true);
      } else initializeTerminationDetection(destination);
    } else {
      if (destination.process.colour === Colour.Black) token.colour = Colour.Black;

      send(destination, destination.process.successor, token);
      destination.process.hasToken = false;
      destination.process.colour = Colour.White;
    }
  }],
]);
