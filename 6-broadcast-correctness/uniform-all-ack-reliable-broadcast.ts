/** Algorytm jednolitego rozgłoszenia niezawodnego z potwierdzeniami od wszystkich - założenia:
 * - Dostęp do {@link BRB podstawowego rozgłaszania niezawodnego}.
 * - Dostęp do {@link ChannelType.PerfectLink niezawodnych kanałów}.
 * - Dostęp do {@link DetectorType.Perfect doskonałego detektora awarii}.
 * - Model przetwarzania oparty o {@link ProcessingModel.FailStop awarii jawnych}.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} optymistyczna: n^2.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} pesymistyczna: n^2.
 * - {@link ComplexityType.Time Złożoność czasowa} optymistyczna: wynosi 2 (od siebie i od reszty).
 * - {@link ComplexityType.Time Złożoność czasowa} pesymistyczna: wynosi n + 1.
 */
import { BRB } from "./best-effort-broadcast";
import {
  addListeners,
  Crash,
  deliverURB,
  Frame,
  Message,
  ReceiveBestEffortBroadcast,
  sendBRB,
  SendUniformReliableBroadcast,
  SideEffect,
  uuid,
} from "../definitions";
import { monitors } from "../globals";
import { issubsetof, map, waitfor } from "../utils";

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
  pending: Set<Packet>;
  correct: Set<Process>;
  ack: Set<[Packet, Process]>;
}

addListeners([
  [SendUniformReliableBroadcast, (process: Process, processes: Process[], message: Message) => {
    const packet = { origin: process, message };

    process.pending.add(packet);
    sendBRB(process.monitor, processes, packet);
  }],
  [ReceiveBestEffortBroadcast, (sender: Monitor, destination: Monitor, packet: Packet) => {
    destination.process.ack.add([packet, sender.process]);
    if (destination.process.pending.has(packet)) return;

    destination.process.pending.add(packet);
    sendBRB(destination.process.monitor, monitors, packet);
  }],
  [Crash, (self: Process, dead: Process) => self.correct.delete(dead)],
  // Oczekiwanie na pakiet, który został dostarczony w wyniku retransmisji przez wszystkie poprawne procesy.
  [SideEffect, async <StatePredicate>(self: Process) => {
    let packets: Packet[] = [];
    await waitfor(() => {
      packets = [...self.pending]
        .filter((packet) => !self.delivered.has(packet))
        .filter((packet) => {
          const hasTransmitted = new Set(
            [...self.ack]
              .filter(([{ message: { id } }]) => id === packet.message.id)
              .map(([, p]) => p),
          );

          return issubsetof(self.correct, hasTransmitted);
        });

      return packets.length > 0;
    });

    for (const packet of packets) {
      self.delivered.add(packet);
      deliverURB(packet.origin, self, packet.message);
    }
  }],
]);

