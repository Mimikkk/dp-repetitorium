import {
  Activation,
  addListeners,
  decide,
  deliver,
  Frame,
  Message, Receive,
  receive, Send,
  send,
  Start,
  uuid,
} from "../definitions";
import { monitors, processes } from "../globals";
import { waitfor } from "../utils";
interface Packet extends Frame {
  message: Message;
}

interface Reply extends Frame {
  continuesPassive: boolean;
  sentNos: number[];
}

interface Query extends Frame {
  sentNos: number[];
}

interface Monitor {
  process: Process;
}

interface Process {
  id: uuid;
  monitor: Monitor;
  available: Set<Process>;
  inTransit: Set<Process>;
  sentNosTable: number[][];
  sentNos: number[];
  recvNos: number[];
  isPassive: boolean;
  continuesPassive: boolean;
  activate: (..._: any[]) => boolean;
}

addListeners([
  [Start, async <TerminationDetection>(initializer: Monitor) => {
    await waitfor(() => {
        monitors.forEach((monitor) => {
          const column = initializer.process.sentNosTable.map((_, i, table) => table[i][monitor.process.id]);

          send(initializer, monitor, { sentNos: column });
        });

        return monitors.map((monitor) => {
          const reply = receive<Reply, {}>(monitor, initializer);
          initializer.process.sentNosTable.forEach((_, i, table) => table[i][monitor.process.id] = reply.sentNos[i]);
          return reply;
        }).every(({ continuesPassive }) => continuesPassive);
      },
    );
    decide(true);
  }],
  [Send, (sender: Process, destination: Process, message: Message) => {
    ++destination.sentNos[sender.id];
    send(sender.monitor, destination.monitor, { message });
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    ++destination.process.recvNos[sender.process.id];
    deliver(sender.process, destination.process, packet.message);
  }],
  [Receive, (initializer: Monitor, destination: Monitor, query: Query) => {
    destination.process.inTransit =
      new Set(processes.filter((p) => query.sentNos[p.id] > destination.process.sentNos[p.id]));

    const continuesPassive = destination.process.continuesPassive &&
      !destination.process.activate(new Set([...destination.process.inTransit, initializer.process]));

    destination.process.continuesPassive = destination.process.isPassive;
    send(destination, initializer, { continuesPassive, sentNos: destination.process.sentNos });
  }],
  [Activation, (self: Process) => self.isPassive = false],
]);
