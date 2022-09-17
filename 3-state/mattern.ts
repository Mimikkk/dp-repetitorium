/** Algorytm wektorowy detekcji stanu globalnego — założenia:
 * - Monitory połączone w logiczny pierścień.
 * */
import {
  deliver,
  Frame,
  VectorClock,
  Message,
  receive,
  send,
  uuid,
  addListeners,
  Start,
  Send,
  Receive,
} from "../definitions";
import { omit } from "../utils";
import { processes } from "../globals";

interface Packet extends Frame {
  clock: VectorClock;
  message: Message;
}

interface Control extends Frame {
  clock: VectorClock;
}
interface Ack extends Frame {}

type ChannelState<T extends "in" | "out" = "in" | "out"> = Set<Message> & {
  out: ChannelState<"out">[];
  in: ChannelState<"in">[];
} & (T extends "in" ? {
  direction: Process;
} : {
  source: Process;
})

interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;
  clock: VectorClock;
  lastRecordingClock: VectorClock;
  recorded: boolean;
  state: Process.State;
  channels: {
    in: ChannelState<"in">[];
    out: ChannelState<"out">[];
  } & ChannelState[];
  initializer: null | Monitor;
}
module Process { export interface State {} }

addListeners([
  [Start, <TakeSnapshot>(initializer: Monitor) => {
    initializer.process.clock.tickAt(initializer.process.id);
    send(initializer, omit(processes, initializer), { clock: initializer.process.clock } as Control);
    // Ack from all processes except the initializer
    receive(omit(processes, initializer), initializer);
    initializer.process.state = initializer.process.state;
    initializer.process.recorded = true;
    send(initializer, omit(processes, initializer), { clock: initializer.process.clock });
  }],
  [Send, (sender: Process, destination: Process, message: Message) => {
    destination.clock.tickAt(destination.id);
    send(sender.monitor, destination.monitor, { clock: sender.clock, message });
  }],
  [Receive, <Control>(sender: Monitor, destination: Monitor) => {
    destination.process.initializer = sender;
    send<Ack>(destination, sender);
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    destination.process.clock.sync(packet.clock);
    if (destination.process.recorded && packet.clock.isNotLaterOrSameAs(destination.process.lastRecordingClock)) {
      send(destination.process, destination.process.initializer, { channels: packet.message });
    }
    if (!destination.process.recorded &&
      destination.process.clock.isLaterOrSameAs(destination.process.lastRecordingClock)) {
      send(destination.process, destination.process.initializer, { process: destination.process.state });
      destination.process.recorded = true;
    }

    if (packet.message) {
      deliver(sender.process, destination.process, packet.message);
    }
  }],
]);
