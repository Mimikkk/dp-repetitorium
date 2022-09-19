import { addListeners, deliver, Frame, Message, Receive, send, SendX, Start, uuid } from "../definitions";

/**
 * Algorytm Chandy-Lamport'a zakłada kanały fifo w każdym kierunku.
 * Gdzie istnienie kanałów fifo pośrednio gwarantując uporządkowanie komunikatów
 * gwarantują, że zbiór wiadomości wysłanych jest zbiorem znaczników w chwilii T_i,
 * zapamiętywania stanu lokalnego procesu P_i jest jednocześnie zbiorem wiadomości odbieranych przez P_j do chwilii otrzymania znacznika.
 */

interface Packet extends Frame {
  state: State;
  message: Message;
}


interface Marker extends Frame {}
interface ProcessState {}

type ChannelState<T extends "in" | "out" = "in" | "out"> = Set<Message> & {
  out: ChannelState<"out">[];
  in: ChannelState<"in">[];
} & (T extends "in" ? {
  direction: Process;
} : {
  source: Process;
})

interface State {
  process: ProcessState;
  channels: ChannelState[];
}

const send_ = send;
module State {

  export const record = (process: Process) => {
    process.channels.in.forEach((channel) => channel.clear());
    process.isInvolved = true;

    send_<Marker>(process.monitor, process.channels.out);
  };
  export const send = (initializer: Process, process: Process) => {
    send_(process.monitor, initializer.monitor, {
      process: process.state,
      channels: process.channels,
    });
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
  channels: {
    in: ChannelState<"in">[];
    out: ChannelState<"out">[];
  } & ChannelState[];
  state: ProcessState;
}

addListeners([
  [Start, <TakeSnapshot>(process: Process) => {
    State.record(process);
    process.receivedMarker[process.id] = true;
  }],
  [SendX, (sender: Process, destination: Process, message: Message) =>
    send(sender.monitor, destination.monitor, message),
  ],
  [Receive, <Marker>(sender: Monitor, destination: Monitor) => {
    if (!destination.process.isInvolved)
      State.record(destination.process);
    destination.process.receivedMarker[sender.process.id] = true;

    destination
      .process.channels.in
      .filter(({ direction }) =>
        direction.receivedMarker[direction.id],
      )
      .forEach(({ direction }) =>
        State.send(direction, destination.process),
      );
  }],
  [Receive, (sender: Monitor, destination: Monitor, packet: Packet) => {
    if (destination.process.isInvolved &&
      !destination.process.receivedMarker[sender.process.id])
      destination.process.channels[sender.process.id].add(packet.message);

    deliver(sender.process, destination.process, packet.message);
  }],
]);
