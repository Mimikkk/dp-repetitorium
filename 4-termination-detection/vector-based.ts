import {
  addListeners,
  decide,
  deliver,
  Frame,
  Message, Receive, Send,
  send, Start,
  uuid,
} from "../definitions";
import { processes } from "../globals";

interface Packet extends Frame {
  message: Message;
}

interface Token extends Frame {
  balances: number[];
}

interface Monitor {
  process: Process;
  successor: Process;
}

interface Process {
  id: uuid;
  monitor: Monitor;
  balances: number[];
  firstCycle: boolean;
}

addListeners([
  [Start, <TerminationDetection>(initializer: Monitor) => {
    send(initializer, initializer.successor, {
      balances: Array(processes.length).fill(0),
    });
    initializer.process.firstCycle = false;
  }],
  [Send, (sender: Process, destination: Process, message: Message) => {
    ++destination.balances[sender.id];
    send(sender.monitor, destination.monitor, { message });
  }],
  [Receive, (
    predecessor: Monitor,
    destination: Monitor,
    token: Token,
  ) => {
    destination.process.balances.forEach(
      (_, i, a) => (a[i] += token.balances[i]),
    );
    if (destination.process.balances[destination.process.id] <= 0) return;
    if (
      !destination.process.firstCycle &&
      destination.process.balances.every((balance) => balance === 0)
    ) {
      decide(true);
      token.balances = destination.process.balances;
    } else {
      send(destination, destination.successor, token);
      destination.process.balances.fill(0);
      destination.process.firstCycle = false;
    }
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    deliver(sender.process, destination.process, packet.message);
    --destination.process.balances[sender.process.id];
    if (destination.process.balances[sender.process.id] === 0) {
      if (
        !destination.process.firstCycle &&
        destination.process.balances.every((balance) => balance === 0)
      ) {
        decide(true);
      } else {
        send(destination, destination.successor, {
          balances: destination.process.balances,
        });
        destination.process.balances.fill(0);
        destination.process.firstCycle = false;
      }
    }
  }],
]);

