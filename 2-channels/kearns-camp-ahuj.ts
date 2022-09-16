import {
  addListeners,
  deliver, FlushType,
  Frame,
  Message, Receive,
  send,
  SendBackward,
  SendForward,
  SendOrdinary,
  SendTwoWay,
} from "../definitions";
import { range } from "../utils";

// Algorytm implementujący sieć monitorów, które dbają o dostarczenie wiadomości
// w kolejności określanej przez oczekiwany typ kanału dla wiadomości.

//@ts-expect-error - its a mock
class Packet extends Frame {
  type: FlushType;
  sequenceNo: number;
  expectedNo: number;
  message: Message;
  isDeliverable = (sender: Process, destination: Process) => {
    const { isNonBackwardable, isNonForwardable } = FlushType;
    const { expectedNo, type } = this;

    const delivered = destination.deliveredNos[sender.id];

    const isEveryPacketFromStartDelivered = range(1, expectedNo + 1).every((x) => delivered.has(x));
    const isFirstOrNotDelivered = expectedNo === 0 || delivered.has(expectedNo);

    return (
      (isNonForwardable(type) && isFirstOrNotDelivered) ||
      (isNonBackwardable(type) && isEveryPacketFromStartDelivered)
    );
  };
}

interface Process {
  id: number;
  awaiting: Set<Packet>[];
  sequenceNos: number[];
  expectedNos: number[];
  deliveredNos: Set<number>[];
  monitor: Monitor;
}

interface Monitor {
  process: Process;
}

addListeners([
  [SendOrdinary, (sender: Process, destination: Process, message: Message) =>
    send(sender.monitor, destination.monitor, {
      type: FlushType.Ordinary,
      sequenceNo: ++sender.sequenceNos[destination.id],
      expectedNo: sender.expectedNos[destination.id],
      message,
    })],
  [SendForward, (sender: Process, destination: Process, message: Message) =>
    send(sender.monitor, destination.monitor, {
      type: FlushType.Forward,
      sequenceNo: ++sender.sequenceNos[destination.id],
      expectedNo: sender.expectedNos[destination.id] - 1,
      message,
    })],
  [SendBackward, (sender: Process, destination: Process, message: Message) => {
    send(sender.monitor, destination.monitor, {
      type: FlushType.Backward,
      sequenceNo: ++sender.sequenceNos[destination.id],
      expectedNo: sender.expectedNos[destination.id],
      message,
    });
    sender.expectedNos[destination.id] = sender.sequenceNos[destination.id];
  }],
  [SendTwoWay, (sender: Process, destination: Process, message: Message) => {
    send(sender.monitor, destination.monitor, {
      type: FlushType.TwoWay,
      sequenceNo: ++sender.sequenceNos[destination.id],
      expectedNo: sender.sequenceNos[destination.id] - 1,
      message,
    });
    sender.expectedNos[destination.id] = sender.sequenceNos[destination.id];
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    const delivered = destination.process.deliveredNos[sender.process.id];
    const awaiting = destination.process.awaiting[sender.process.id];
    awaiting.add(packet);

    while (true) {
      const packet = [...awaiting[sender.process.id]].find((packet) =>
        packet.isDeliverable(sender.process, destination.process),
      );

      if (!packet) return;
      deliver(sender.process, destination.process, packet.message);
      delivered.add(packet.sequenceNo);
      awaiting.delete(packet);
    }
  }],
]);
