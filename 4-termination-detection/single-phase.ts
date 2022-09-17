/** Algorytm jednofazowy detekcji zakończenia — założenia:
 * - Monitory połączone w logiczny pierścień.
 * */
import { addListeners, decide, deliver, Frame, Message, Receive, Send, send, Start, uuid } from "../definitions";

interface Packet extends Frame {
  detectionNo: number;
  message: Message;
}

interface Token extends Frame {
  initializer: Monitor;
  detectionNo: number;
  balance: number;
  isInvalid: boolean;
}

interface Monitor {
  process: Process;
  successor: Process;
}

interface Process {
  id: uuid;
  monitor: Monitor;
  detectionNo: number;
  maxDetectionNo: number;
  balance: number;
}

const initializeDetection = <TerminationDetection>(initializer: Monitor) => {
  ++initializer.process.detectionNo;

  send(initializer, initializer.successor, {
    detectionNo: initializer.process.detectionNo,
    balance: initializer.process.balance,
    isInvalid: false,
    initializer,
  });
};
addListeners([
  [Start, initializeDetection],
  [Send, (sender: Process, destination: Process, message: Message) => {
    ++sender.balance;
    send(sender.monitor, destination.monitor, {
      detectionNo: sender.detectionNo,
      message,
    });
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    --destination.process.balance;
    destination.process.maxDetectionNo = Math.max(
      destination.process.maxDetectionNo,
      packet.detectionNo,
    );
    deliver(sender.process, destination.process, packet.message);
  }],
  [Receive, (
    predecessor: Monitor,
    destination: Monitor,
    token: Token,
  ) => {
    destination.process.detectionNo = Math.max(
      destination.process.detectionNo,
      token.detectionNo,
    );

    if (token.initializer.process.id === destination.process.id) {
      if (!token.isInvalid && token.balance === 0) {
        decide(true);
      } else initializeDetection(destination);
    } else {
      token.detectionNo = destination.process.detectionNo;
      token.balance += destination.process.balance;
      token.isInvalid ||= destination.process.maxDetectionNo >= token.detectionNo;
      send(destination, destination.successor, token);
    }
  }],
]);
