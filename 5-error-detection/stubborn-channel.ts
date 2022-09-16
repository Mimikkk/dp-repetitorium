import { addListeners, deliverSB, Frame, Message, ReceiveFairLoss, sendFL, SendStubborn } from "../definitions";
import { delay } from "../utils";
import { time } from "../globals";

interface Packet extends Frame {
  message: Message;
}
interface Process {
  id: number;
  monitor: Monitor;
}
interface Monitor {
  process: Process;
}

addListeners([
  [SendStubborn, async (sender: Process, destination: Process, message: Message) => {
    while (true) {
      sendFL(sender.monitor, destination.monitor, { message });
      await delay(time);
    }
  }],
  [ReceiveFairLoss, (sender: Monitor, destination: Monitor, packet: Packet) => {
    deliverSB(sender, destination, packet.message);
  }],
]);