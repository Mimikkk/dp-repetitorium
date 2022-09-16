/** Algorytm jednolitego rozgłoszenia niezawodnego z potwierdzeniami od wszystkich - założenia:
 * - Dostęp do {@link ChannelType.Stubborn kanałów rzetelnych}.
 * - Dostęp do dowolenego {@link BroadcastType rozgłaszania}.
 */
import {
  addListeners,
  deliverPRB,
  Frame,
  ListenerType,
  Message,
  ReceiveFairLoss, sendFL,
  uuid,
} from "../definitions";
import { monitors } from "../globals";
import { pickmany, omit } from "../utils";

interface Packet extends Frame {
  round: number;
  origin: Process;
  message: Message;
}
interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;
  delivered: Set<Message>;
  maxRounds: number;
  fanout: number;
}

const gossip = (self: Process, packet: Packet) => {
  const targets = pickmany(omit(monitors, self.monitor), self.fanout);
  sendFL(self.monitor, targets, packet);
};

addListeners([
  [ListenerType.SendProbabilisticReliableBroadcast, (sender: Process, destinations: Process[], message: Message) => {
    gossip(sender, { round: sender.maxRounds, origin: sender, message });
  }],
  [ReceiveFairLoss, (sender: Process, destination: Process, packet: Packet) => {
    if (destination.delivered.has(packet.message)) {
      destination.delivered.add(packet.message);
      deliverPRB(packet.origin, destination, packet.message);
    }
    if (packet.round > 0) gossip(destination, { ...packet, round: packet.round - 1 });
  }],
]);
