import {
  Activation,
  addListeners,
  decide,
  deliver,
  Frame,
  Message,
  Receive,
  receive,
  Send,
  send,
  Start,
  uuid,
} from "../definitions";
import { monitors } from "../globals";
import { waitfor } from "../utils";
interface Packet extends Frame {
  message: Message;
}

interface Reply extends Frame {
  continuesPassive: boolean;
}

interface Query extends Frame {}
interface Ack extends Frame {}

interface Monitor {
  process: Process;
}

interface Process {
  id: uuid;
  monitor: Monitor;
  available: Set<Process>;
  notAcknowledgedCount: number;
  isPassive: boolean;
  continuesPassive: boolean;
  activate: (..._: any[]) => boolean;
}

addListeners([
  [Start, async <TerminationDetection>(initializer: Monitor) => {
    await waitfor(() => {
        send<Query>(initializer, monitors);

        return receive<Reply, []>(monitors, initializer).every(({ continuesPassive }) => continuesPassive);
      },
    );

    decide(true);
  }],
  [Send, (sender: Process, destination: Process, message: Message) => {
    ++sender.notAcknowledgedCount;
    send(sender.monitor, destination.monitor, { message });
  }],
  [Receive, async <Query>(initializer: Monitor, destination: Monitor) => {
    const { activate, isPassive, notAcknowledgedCount, available } = destination.process;
    await waitfor(() => isPassive && notAcknowledgedCount === 0 && !activate(available));
    const { continuesPassive } = destination.process;
    destination.process.continuesPassive = true;
    send(destination, initializer, { continuesPassive });
  }],
  [Receive, async <Ack>(initializer: Monitor, destination: Monitor) => {
    --destination.process.notAcknowledgedCount;
  }],
  [Receive, async (initializer: Monitor, destination: Monitor, packet: Packet) => {
    send<Ack>(destination, initializer);
    deliver(destination, initializer, packet.message);
  }],
  [Activation, (process: Process) => process.continuesPassive = false],
]);
