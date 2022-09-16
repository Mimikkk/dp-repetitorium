import { addListeners, Clock, Frame, ReceivePerfectLink, sendPL } from "../definitions";
import { monitors, processes } from "../globals";

// Założenia:
// - Niezawodne kanały.
// - Synchroniczny model systemu.
// - Czasy przetwarzania lokalnego i przesunięcia zegarów są pomijalne.

interface HeartBeat extends Frame {}
interface Process {
  id: number;
  monitor: Monitor;
  correct: Set<Process>;
  suspected: Set<Process>;
}
interface Monitor {
  process: Process;
}

addListeners([
  [Clock, <WaitDelay>(self: Process) => {
    processes.filter((process) => !self.correct.has(process) && !self.suspected.has(process))
             .forEach(self.suspected.add);

    self.correct.clear();
  }],
  [Clock, <PulseDelay>(self: Process) => sendPL<HeartBeat>(self.monitor, monitors)],
  [ReceivePerfectLink, (sender: Monitor, destination: Monitor) => {
    destination.process.correct.add(sender.process);
  }],
]);
