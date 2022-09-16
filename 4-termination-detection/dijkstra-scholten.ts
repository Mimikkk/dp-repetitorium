import { addListeners, decide, deliver, Frame, Message, Receive, Send, send, Start, uuid } from "../definitions";
import { map, waitfor } from "../utils";

interface Packet extends Frame {
  message: Message;
}
interface Signal extends Frame {}

interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;

  engager: Process;
  notEngager: Set<Process>;
  recvNo: number;
  sentNo: number;
  passive: boolean;
  isInitializer: boolean;
}

addListeners([
  [Start, <TerminationDetection>(initializer: Process, children: Process[], message: Message) => {
    initializer.sentNo = children.length;
    send(initializer.monitor, map(children, "monitor"), { message });
  }],
  [Send, <_Signal>(sender: Monitor, destination: Monitor) => {
    if (sender.process.recvNo === 1 && sender.process.sentNo === 0 && sender.process.passive) {
      send<Signal>(sender, sender.process.engager.monitor);
    } else {
      send<Signal>(sender, map(sender.process.notEngager, "monitor"));
      sender.process.notEngager.clear();
    }

    --sender.process.recvNo;
  }],
  [Send, (sender: Process, destination: Process, message: Message) => {
    ++sender.sentNo;
    send(sender.monitor, destination.monitor, { message });
  }],
  [Receive, async <Signal>(sender: Monitor, destination: Monitor) => {
    if (!destination.process.isInitializer || --destination.process.sentNo) return;

    await waitfor(() => destination.process.passive);
    decide(true);
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    if (destination.process.isInitializer) {
      destination.process.engager = sender.process;
    } else {
      destination.process.engager = sender.process;
    }
    deliver(sender.process, destination.process, packet);
  }],
]);
