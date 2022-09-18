import { addListeners, deliver, Message, Receive, Send, send, VectorClock } from "../definitions";
import { processes } from "../globals";
import { omit, waitfor } from "../utils";

// Gwarancja kolejności dostarczenia wiadomości w sieciach monitorów poprzez każdorazowe
// rozgłaszanie wektora kolejności zdarzeń każdego z procesów.

interface Packet {
  clock: VectorClock;
  message: Message;
}
interface Process {
  clock: VectorClock;
  id: number;
}
interface Monitor {
  process: Process;
}

addListeners([
  [Send, (sender: Process, destination: Process, message: Message) => {
    sender.clock.tickAt(sender.id);
    send(sender, omit(processes, sender), { clocks: sender.clock, message });
  }],
  [Receive, async (sender: Monitor, destination: Monitor, { message, clock }: Packet) => {
    await waitfor(() =>
      destination.process.clock[sender.process.id] === clock[sender.process.id] - 1 &&
      omit(processes, sender).every(({ clock }) => destination.process.clock.isLaterOrSameAs(clock)),
    );

    if (message.destinationId === destination.process.id)
      deliver(sender.process, destination.process, message);

    destination.process.clock.sync(clock);
  }],
]);
