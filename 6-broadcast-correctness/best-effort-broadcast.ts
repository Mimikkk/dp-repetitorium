/** Algorytm podstawowego rozgłaszania niezawodnego - założenia:
 * - Dostęp do {@link ChannelType.PerfectLink kanałów niezawodnych}.
 * - Model przetwarzania oparty o {@link ProcessingModel.FailSilent ukryte awarie}.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} wynosi n.
 * - {@link ComplexityType.Time Złożoność czasowa} wynosi 1.
 */
import {
  addListeners,
  deliverBRB,
  Frame,
  Message,
  ReceivePerfectLink,
  SendBestEffortBroadcast,
  sendPL,
} from "../definitions";
import { monitors } from "../globals";

interface Packet extends Frame {
  message: Message;
}
interface Monitor {
  process: Process;
}
interface Process {
  monitor: Monitor;
}

addListeners([
  [SendBestEffortBroadcast, (sender: Process, destinations: Process[], message: Message) => {
    sendPL(sender.monitor, monitors, { message });
  }],
  [ReceivePerfectLink, (sender: Monitor, destination: Monitor, packet: Packet) => {
    deliverBRB(sender.process, destination.process, packet.message);
  }],
]);
