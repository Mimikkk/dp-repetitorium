/** Algorytm jednolitego rozgłoszenia niezawodnego z potwierdzeniami od wszystkich - założenia:
 * - Dostęp do {@link ChannelType.Stubborn kanałów rzetelnych}.
 */
import {
  addListeners,
  deliverPRB,
  Frame,
  ListenerType,
  Message, Receive,
  ReceiveFairLoss, sendFL, sendX,
  uuid,
} from "../definitions";
import { monitors } from "../globals";
import { pickmany, omit, random, range } from "../utils";

interface Packet extends Frame {
  sequenceNo: number;
  origin: Process;
  message: Message;
}

interface Request extends Packet {
  round: number;
  requestedBy: Process;
}
interface Answer extends Packet {}

interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;
  delivered: Set<Message>;
  maxRounds: number;
  fanout: number;
  storeThreshold: number;
  sequenceNo: number;
  sequenceNos: number[];
  pending: Set<Packet>;
  stored: Set<Packet>;
  targets: Set<Process>;
}

const gossip = (self: Process, packet: Packet) => {
  const targets = pickmany(omit(monitors, self.monitor), self.fanout);
  sendFL(self.monitor, targets, packet);
};
const deliverPending = (self: Process, destination: Process) => {
  const pending = [...self.pending].filter(packet => packet.origin === destination);
  let sendable: Packet;
  do {
    sendable = pending.find(({ sequenceNo }) => sequenceNo === destination.sequenceNo + 1);

    if (sendable) {
      ++destination.sequenceNos[sendable.origin.id];
      self.pending.delete(sendable);
      deliverPRB(sendable.origin, destination, sendable.message);
    }
  } while (sendable);
};

addListeners([
  [ListenerType.SendProbabilisticReliableBroadcast, (sender: Process, destinations: Process[], message: Message) => {
    sendX(sender.monitor, monitors, { origin: sender, message, sequenceNo: sender.sequenceNo });
  }],
  [ReceiveFairLoss, (sender: Monitor, destination: Monitor, packet: Request) => {

  }],
  [ReceiveFairLoss, (sender: Monitor, destination: Monitor, packet: Answer) => {

  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    if (random(destination.process.storeThreshold))
      destination.process.stored.add(packet);

    if (packet.sequenceNo === destination.process.sequenceNo + 1) {
      ++destination.process.sequenceNo;
      deliverPRB(destination.process, destination.process, packet.message);
    } else {
      destination.process.pending.add(packet);
      range(destination.process.sequenceNo, packet.sequenceNo + 1).forEach((s) => {
        // TODO
        gossip(destination.process, {} as any);
      });
    }
  }],
]);
