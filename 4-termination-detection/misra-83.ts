import { addListeners, decide, deliver, Frame, Message, Receive, send, Start, uuid } from "../definitions";
import { waitfor } from "../utils";
import { processes } from "../globals";

enum Colour { White, Black }
interface Packet extends Frame {
  message: Message;
}
interface Token extends Frame {
  passiveProcessesCount: number;
}

interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;

  successor: Process;
  hasToken: boolean;
  colour: Colour;
  sentNo: number;
  passive: boolean;
  isInitializer: boolean;
}

addListeners([
  [Start, <TerminationDetection>(initializer: Process) => {
    send(initializer.monitor, initializer.successor.monitor, { passiveProcessesCount: 0 });
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    destination.process.colour = Colour.Black;
    destination.process.passive = false;
    deliver(sender.process, destination.process, packet.message);
  }],
  [Receive, async (predecessor: Monitor, destination: Monitor, token: Token) => {
    if (destination.process.isInitializer) return;

    destination.process.hasToken = true;
    await waitfor(() => destination.process.passive);

    if (destination.process.colour === Colour.Black) {
      token.passiveProcessesCount = 0;
    } else ++token.passiveProcessesCount;
    send(destination, destination.process.successor.monitor, token);
    destination.process.colour = Colour.White;
    destination.process.hasToken = false;
  }],
  [Receive, async (predecessor: Monitor, initializer: Monitor, token: Token) => {
    if (!initializer.process.isInitializer) return;

    initializer.process.hasToken = true;
    if (initializer.process.colour === Colour.White && token.passiveProcessesCount === processes.length - 1) {
      decide(true);
    } else {
      if (initializer.process.colour === Colour.Black) {
        token.passiveProcessesCount = 0;
      } else {
        ++token.passiveProcessesCount;
      }
      send(initializer, initializer.process.successor.monitor, token);
      initializer.process.colour = Colour.White;
      initializer.process.hasToken = false;
    }
  }],
]);
