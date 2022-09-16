/** Algorytm jednolitego rozgłoszenia niezawodnego z potwierdzeniami od wszystkich - założenia:
 * - Dostęp do {@link BRB podstawowego rozgłaszania niezawodnego}.
 * - Dostęp do {@link ChannelType.PerfectLink niezawodnych kanałów}.
 * - Dostęp do {@link DetectorType.Perfect doskonałego detektora awarii}.
 * - Model przetwarzania oparty o {@link ProcessingModel.FailStop awarii jawnych}.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} optymistyczna: n^2.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} pesymistyczna: O(n^3).
 * - {@link ComplexityType.Time Złożoność czasowa} optymistyczna: wynosi 1.
 * - {@link ComplexityType.Time Złożoność czasowa} pesymistyczna: wynosi n.
 */
import { BRB } from "../6-broadcast-correctness/best-effort-broadcast";
import {
  addListeners,
  Crash, decideRC,
  Frame,
  ProposeRegular,
  ReceiveBestEffortBroadcast,
  sendBRB,
  SideEffect,
  uuid, Value,
} from "../definitions";
import { monitors, processes } from "../globals";
import { issubsetof, waitfor } from "../utils";

interface Proposal extends Frame {
  value: Value;
  round: number;
}
interface Decision extends Proposal {}

interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;
  correct: Set<Process>;
  round: number;
  decided: Value;
  proposed: Set<Value>[];
  correctThisRound: Set<Process>[];
}

addListeners([
  [ProposeRegular, (self: Process, value: Value) => {
    self.correctThisRound[0] = new Set(processes);
    (processes as Process[]).forEach((_, i) => {
      self.correctThisRound[i].clear();
      self.proposed[i].clear();
    });
    sendBRB<Proposal>(self.monitor, monitors, { round: self.round, value });
  }],
  [ReceiveBestEffortBroadcast, (sender: Monitor, destination: Monitor, proposal: Proposal) => {
    destination.process.proposed[proposal.round].add(proposal.value);
    destination.process.correctThisRound[proposal.round].add(sender.process);
  }],
  [ReceiveBestEffortBroadcast, (sender: Monitor, destination: Monitor, decision: Decision) => {
    if (destination.process.decided) return;
    destination.process.decided = decision.value;
    decideRC(destination.process, destination.process.decided);
    sendBRB<Decision>(destination.process, monitors, { ...decision, round: destination.process.round + 1 });
  }],
  [Crash, (self: Process, dead: Process) => self.correct.delete(dead)],
  [SideEffect, async <StatePredicate>(self: Process, value: Value) => {
    await waitfor(() => self.decided && issubsetof(self.correct, self.correctThisRound[self.round]));
    if (self.correctThisRound[self.round] === self.correctThisRound[self.round - 1]) {
      self.decided = Math.min(...self.proposed[self.round]);
      decideRC(self, self.decided);
      sendBRB<Decision>(self, monitors, { round: self.round, value: self.decided });
    } else {
      ++self.round;
      sendBRB(self, monitors, { round: self.round, value });
    }
  }],
]);
