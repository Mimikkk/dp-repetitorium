import { addListeners, Clock, Frame, ReceivePerfectLink, sendPL } from "../definitions";
import { monitors, processes } from "../globals";

// Założenia:
// - Niezawodne kanały.
// - Hybrydowy model systemu.
// - Czasy przetwarzania lokalnego i przesunięcia zegarów są pomijalne.

interface HeartBeat extends Frame {}
interface Process {
  id: number;
  monitor: Monitor;
  correct: Set<Process>;
  suspected: Set<Process>;
  waitDelay: number;
  pulseDelay: number;
}
interface Monitor {
  process: Process;
}

addListeners([
  [Clock, <WaitDelay>(self: Process) => {
    processes.forEach((process) => {
      if (!self.correct.has(process)) {
        self.suspected.add(process);
      } else if (self.suspected.has(process)) {
        self.suspected.delete(process);
        ++self.waitDelay;
      }
    });

    self.correct.clear();
  }],
  [Clock, <PulseDelay>(self: Process) => sendPL<HeartBeat>(self.monitor, monitors)],
  [ReceivePerfectLink, (sender: Monitor, destination: Monitor) => {
    destination.process.correct.add(sender.process);
  }],
]);
