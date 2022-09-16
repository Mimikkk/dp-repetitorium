import { addListeners, Clock, Frame, Receive, Recover, retrieve, sendFL, sendPL, store } from "../definitions";
import { monitors } from "../globals";

// Założenia:
// - Dostępność rzetelnych kanałów ( Fair Loss ).
// - Odtwarzalność procesów ( możliwość zapisania wybranych parametrów do pamięci globalnej ).
// - Hybrydowy model systemu.

interface HeartBeat extends Frame {
  epochNo: number;
}
interface Trusted extends Frame {
  process: Process;
  epochNo: number;
}
interface Process {
  id: number;
  monitor: Monitor;
  leader: Process;
  previousLeader: Process;
  candidates: Set<Trusted>;
  epochNo: number;
  waitDelay: number;
  pulseDelay: number;
}
interface Monitor {
  process: Process;
}

const selectLeader = (candidates: Set<Trusted>): Process =>
  [...candidates].reduce((leader, candidate) =>
    candidate.epochNo < leader.epochNo ||
    candidate.epochNo === leader.epochNo && candidate.process.id < leader.process.id
      ? candidate
      : leader,
  ).process;

addListeners([
  [Clock, <WaitDelay>(self: Process) => {
    if (self.candidates.size !== 0) {
      [self.previousLeader, self.leader] = [self.leader, selectLeader(self.candidates)];
      if (self.leader !== self.previousLeader) ++self.waitDelay;
    }
    self.candidates.clear();
  }],
  [Clock, <PulseDelay>(self: Process) => {
    sendPL<HeartBeat>(self.monitor, monitors, { epochNo: self.epochNo });
  }],
  [Receive, (sender: Monitor, destination: Monitor, heartbeat: HeartBeat) => {
    const { candidates } = destination.process;

    const senderCandidate = [...candidates].find(({ process: { id }, epochNo }) =>
      id === sender.process.id &&
      epochNo === heartbeat.epochNo,
    );
    if (senderCandidate) {
      candidates.delete({ epochNo: heartbeat.epochNo, process: sender.process });
    }
    candidates.add({ epochNo: heartbeat.epochNo, process: sender.process });
  }],
  [Recover, (self: Process) => {
    retrieve(self, "epochNo");
    ++self.epochNo;
    store(self, "epochNo");
    sendFL(self.monitor, monitors, { epochNo: self.epochNo });
  }],
]);
