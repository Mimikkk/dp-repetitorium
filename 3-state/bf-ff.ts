import {
  deliver,
  Frame,
  Message,
  uuid,
  sendB,
  sendF,
  sendX,
  addListeners,
  Start,
  SendX,
  Receive,
} from "../definitions";

/**
 * Algorytm Chandy-Lamport'a zakłada kanały fifo w każdym kierunku.
 * Gdzie istnienie kanałów fifo pośrednio gwarantując uporządkowanie komunikatów
 * gwarantują, że zbiór wiadomości wysłanych jest zbiorem znaczników w chwilii T_i,
 * zapamiętywania stanu lokalnego procesu P_i jest jednocześnie zbiorem wiadomości odbieranych przez P_j do chwilii otrzymania znacznika.
 */

interface Packet extends Frame {
  sequenceNo: number;
  message: Message;
}


interface ForwardMarker extends Frame {
  previousSequenceNo: number;
}
interface BackwardMarker extends Frame {}
interface ProcessState {}

type ChannelState<T extends "in" | "out" = "in" | "out"> = Set<Message> & {
  out: ChannelState<"out">[];
  in: ChannelState<"in">[];
} & (T extends "in" ? {
  direction: Process;
} : {
  source: Process;
})

module State {

  export const record = (process: Process) => {
    process.channels.in.forEach((channel) => channel.clear());
    process.isInvolved = true;

    sendB<BackwardMarker>(process.monitor, process.channels.out);
    sendF<ForwardMarker>(process.monitor, process.channels.out, { previousSequenceNo: process.sequenceNo });
  };
}

interface Monitor {
  process: Process;
}
interface Process {
  id: uuid;
  monitor: Monitor;
  isInvolved: boolean;
  receivedMarker: boolean[];
  delayed: Set<Packet>;
  sequenceNo: number;
  channels: {
    in: ChannelState<"in">[];
    out: ChannelState<"out">[];
  } & ChannelState[];
  state: ProcessState;
}

addListeners([
  [Start, <TakeSnapshot>(initializer: Process) => {
    State.record(initializer);
    initializer.receivedMarker[initializer.id] = true;
  }],
  [SendX, (sender: Process, destination: Process, message: Message) =>
    sendX(sender.monitor, destination.monitor, {
      sequenceNo: ++sender.sequenceNo,
      message,
    })],
  [Receive, <BackwardMarker>(initializer: Monitor, destination: Monitor) => {
    if (!destination.process.isInvolved) return;
    State.record(destination.process);
  }],
  [Receive, (initializer: Monitor, destination: Monitor, marker: ForwardMarker) => {
    destination.process.receivedMarker[initializer.process.id] = true;
    destination.process.channels[initializer.process.id].clear();

    for (const packet of destination.process.delayed) {
      if (packet.sequenceNo <= marker.previousSequenceNo) {
        destination.process.channels[initializer.process.id].add(packet.message);
      }
    }

    if (destination.process.channels.in.every((channel) => destination.process.receivedMarker[channel.direction.id])) {
      sendX(destination.process, initializer.process, {
        channels: destination.process.channels, process: destination.process.state,
      });
    }
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    if (destination.process.isInvolved && !destination.process.receivedMarker[sender.process.id]) {
      destination.process.delayed.add(packet);
    }
    deliver(sender.process, destination.process, packet.message);
  }],
]);

