/** Algorytm aktywnego zgodnego rozgłoszenia niezawodnego - założenia:
 * - Dostęp do {@link BRB podstawowego rozgłaszania niezawodnego}.
 * - Model przetwarzania oparty o {@link ProcessingModel.FailSilent awarii ukrytych}.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} optymistyczna: wynosi n.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} pesymistyczna: wynosi n^2.
 * - {@link ComplexityType.Time Złożoność czasowa} optymistyczna: wynosi 1.
 * - {@link ComplexityType.Time Złożoność czasowa} pesymistyczna: wynosi n^2.
 */
import {
  addListeners,
  Crash,
  DeliverBestEffortBroadcast, deliverBRB,
  deliverRRB,
  Frame,
  Message, ReceiveReliableRegularBroadcast,
  sendBRB,
  SendReliableRegularBroadcast,
  sendRRB,
  uuid,
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
  delivered: Set<Message>;
}

addListeners([
  [SendReliableRegularBroadcast, (sender: Process, destinations: Process[], message: Message) => {
    deliverRRB(sender, sender, message);
    sender.delivered.add(message);
    sendBRB(sender.monitor, monitors, { origin: sender, message });
  }],
  [ReceiveReliableRegularBroadcast, (sender: Process, destination: Process, packet: Packet) => {
    if (destination.delivered.has(packet.message)) return;
    destination.delivered.add(packet.message);
    deliverRRB(packet.origin, destination, packet.message);
    deliverBRB(sender, destination, sender);
  }],
]);
