/** Algorytm jednolitego rozgłoszenia niezawodnego z potwierdzeniami od wszystkich - założenia:
 * - Dostęp do {@link BRB podstawowego rozgłaszania niezawodnego}.
 * - Dostęp do {@link ChannelType.PerfectLink niezawodnych kanałów}.
 * - Dostęp do {@link DetectorType.Perfect doskonałego detektora awarii}.
 * - Model przetwarzania oparty o {@link ProcessingModel.FailStop awarii jawnych}.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} optymistyczna: n^2.
 * - {@link ComplexityType.Communication Złożoność komunikacyjna} pesymistyczna: n^2.
 * - {@link ComplexityType.Time Złożoność czasowa} optymistyczna: wynosi n.
 * - {@link ComplexityType.Time Złożoność czasowa} pesymistyczna: wynosi n.
 */
import { BRB } from "../6-broadcast-correctness/best-effort-broadcast";
import {
  addListeners,
  Crash,
  decideRC,
  Frame,
  Message,
  ProposeRegular,
  ReceiveBestEffortBroadcast,
  sendBRB,
  SideEffect,
  uuid, Value,
} from "../definitions";
import { monitors, processes } from "../globals";
import { issubsetof, waitfor } from "../utils";

interface Decision extends Frame {
  value: Value;
  round: number;
}

interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;
  proposal: Value;
  round: number;
  proposalNo: number;
  delivered: boolean[];
  leaderSet: Process[];
  broadcast: boolean[];
  suspected: Set<Process>;
}

addListeners([
  [ProposeRegular, (self: Process, value: Value) => self.proposal = value],
  [Crash, (self: Process, dead: Process) => self.suspected.add(dead)],
  [ReceiveBestEffortBroadcast, (sender: Monitor, destination: Monitor, decision: Decision) => {
    if (destination.process.id > decision.round && decision.round > destination.process.proposalNo) {
      destination.process.proposalNo = decision.round;
      destination.process.proposal = decision.value;
    }
    destination.process.delivered[decision.round] = true;
  }],
  [SideEffect, async (self: Process) => {
    await waitfor(() => self.leaderSet[self.round].id === self.id && self.proposal && !self.broadcast[self.round]);
    decideRC(self, self.proposal);
    self.broadcast[self.round] = true;
    sendBRB(self.monitor, monitors, { value: self.proposal, round: self.round });
  }],
  [SideEffect, async (self: Process) => {
    await waitfor(() => self.suspected.has(self.leaderSet[self.round]) && self.delivered[self.round]);
    ++self.round;
  }],
]);
