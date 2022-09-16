/** Algorytm pasywnego zgodnego rozgłoszenia niezawodnego - założenia:
 * - Dostęp do {@link ChannelType.PerfectLink kanałów niezawodnych}.
 * - Dostęp do {@link DetectorType.Perfect doskonałego detektora awarii}.
 * - Model przetwarzania oparty o {@link ProcessingModel.FailStop awarie jawne}.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} optymistyczna: wynosi n.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} optymistyczna: wynosi n^2.
 * - {@link ComplexityType.Time Złożoność czasowa} optymistyczna: wynosi 1.
 * - {@link ComplexityType.Time Złożoność czasowa} pesymistyczna: wynosi n.
 */
import {
  addListeners, Crash, DeliverBestEffortBroadcast,
  deliverBRB, deliverRRB,
  Frame,
  Message,
  ReceivePerfectLink,
  SendBestEffortBroadcast, sendBRB,
  sendPL, SendReliableRegularBroadcast, sendRRB, uuid,
} from "../definitions";
import { monitors } from "../globals";

interface Packet extends Frame {
  origin: Process;
  message: Message;
}
interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;
  correct: Set<Process>;
  delivered: Set<Message>;
  from: Set<Packet>[];
}

addListeners([
  [SendReliableRegularBroadcast, (sender: Process, destinations: Process[], message: Message) => {
    sendBRB(sender.monitor, monitors, { origin: sender, message });
  }],
  [DeliverBestEffortBroadcast, (sender: Monitor, destination: Monitor, packet: Packet) => {
    if (destination.process.delivered.has(packet.message)) return;
    destination.process.delivered.add(packet.message);
    destination.process.from[sender.process.id].add(packet);
    deliverRRB(sender.process, destination.process, packet.message);

    if (sender.process.correct.has(destination.process)) return;
    sendRRB(sender.process, monitors, packet);
  }],
  [Crash, (detector: Monitor, self: Process) => {
    detector.process.correct.delete(self);
    for (const packet of self.from[detector.process.id]) {
      sendBRB(detector.process, monitors, packet);
    }
  }],
]);
