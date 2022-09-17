import { noop } from "./globals";

export type uuid = number;
export type Tag = string;

export interface Frame {
  destinationId?: uuid;
  id?: uuid;
  senderId?: uuid;
  tag?: Tag;
}
export interface Message extends Frame {}

export const send = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see FlushType.Forward */
export const sendF = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see FlushType.Backward */
export const sendB = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see FlushType */
export const sendX = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see ChannelType.FairLoss */
export const sendFL = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see ChannelType.Stubborn */
export const sendSB = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see ChannelType.PerfectLink */
export const sendPL = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see BroadcastType.BestEffort */
export const sendBRB = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see BroadcastType.RegularReliable */
export const sendRRB = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see BroadcastType.UniformReliable */
export const sendURB = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see BroadcastType.UniformReliable */
export const sendPRB = <Packet>(from: any, to: any, packet?: Packet) => {};

export const deliver = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see ChannelType.FairLoss */
export const deliverFL = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see ChannelType.Stubborn */
export const deliverSB = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see ChannelType.PerfectLink */
export const deliverPL = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see BroadcastType.BestEffort */
export const deliverBRB = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see BroadcastType.RegularReliable */
export const deliverRRB = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see BroadcastType.UniformReliable */
export const deliverURB = <Packet>(from: any, to: any, packet?: Packet) => {};
/** @see BroadcastType.ProbabilisticReliable */
export const deliverPRB = <Packet>(from: any, to: any, packet?: Packet) => {};

export const receive = <Packet, T extends {} | []>(
  from: any,
  to: any,
): T extends [] ? Packet[] : Packet => noop;
/** @see ChannelType.FairLoss */
export const receiveFL = <Packet, T extends {} | []>(
  from: any,
  to: any,
): T extends [] ? Packet[] : Packet => noop;
/** @see ChannelType.Stubborn */
export const receiveSB = <Packet, T extends {} | []>(
  from: any,
  to: any,
): T extends [] ? Packet[] : Packet => noop;
/** @see ChannelType.PerfectLink */
export const receivePL = <Packet, T extends {} | []>(
  from: any,
  to: any,
): T extends [] ? Packet[] : Packet => noop;
/** @see BroadcastType.UniformReliable */
export const receiveURB = <Packet, T extends {} | []>(
  from: any,
  to: any,
): T extends [] ? Packet[] : Packet => noop;
/** @see BroadcastType.ProbabilisticReliable */
export const receivePRB = <Packet, T extends {} | []>(
  from: any,
  to: any,
): T extends [] ? Packet[] : Packet => noop;

export const decide = (decision: boolean) => {};
/** @see ConsensusType.Regular */
export const decideRC = (self: any, value: any) => {};

export const store = <T>(self: T, parameter: keyof T) => {};
export const retrieve = <T, Key extends keyof T>(
  self: T,
  parameter: Key,
): T[Key] => noop;

export type Value = any;
/** @see ConsensusType.Regular */
export const proposeRC = <T>(self: T, value: any) => {};

export const addListeners = (pairs: [ListenerType, any][]) => {};

export enum SystemType {
  /**
   * Cechy systemu:
   * - Brak ograniczeń na czas komunikację.
   * - Brak ograniczeń na czas przetwarzania.
   * - Brak dostępu do globalnego zegara.
   * */
  Asynchronous,
  /**
   * Cechy systemu:
   * - Synchroniczna komunikacja.
   * - Synchroniczne przetwarzania.
   * - Dostępu do globalnego zegara.
   * */
  Synchronous,
  /**
   * Cechy systemu:
   * - Znane maksymalne czasy komunikacji/przetwarzania, lecz nie jest znany moment, po którym zaczną one obowiązywać.
   * - Istnieją pewne odcinki czasu, w których system działa asynchronicznie.
   * - Zwykle zachowuje się w sposób synchroniczny.
   * */
  Hybrid,
}

export enum DetectorTrait {
  /** Zdolność do podejrzewania wszystkich procesów niepoprawnych. */
  Completeness,
  /** {@link DetectorTrait.Completeness Kompletność} - Ostatecznie każdy proces niepoprawny będzie trwale podejrzewany przez niektóre procesy poprawne. */
  WeakCompleteness,
  /** {@link DetectorTrait.Completeness Kompletność} - Ostatecznie każdy proces niepoprawny będzie trwale podejrzewany przez wszystkie procesy poprawne. */
  StrongCompleteness,
  /** Zdolność do niepodejrzewania procesów poprawnych. */
  Accuracy,
  /** {@link DetectorTrait.Accuracy Dokładność} - Żaden proces nie jest podejrzewany, dopóki nie stanie się niepoprawny. */
  StrongAccuracy,
  /** {@link DetectorTrait.Accuracy Dokładność} - Czasem proces jest podejrzewany, mimo poprawności. */
  WeakAccuracy,
  /** {@link DetectorTrait.Accuracy Dokładność} - Po pewnym czasie wszystkie podejrzewane procesy poprawne, przestaną być podejrzewane przez wszystkie procesy poprawne. Zapewnia własność żywotności. */
  EventualStrongAccuracy,
  /** {@link DetectorTrait.Accuracy Dokładność} - Po pewnym czasie niektóre podejrzewane procesy poprawne, przestaną być podejrzewane przez niektóre procesy poprawne. Zapewnia własność żywotności. */
  EventualWeakAccuracy,
}

export enum DetectorType {
  /** Detektor awarii klasy P:
   * - Posiada własność {@link DetectorTrait.StrongCompleteness silnej kompletności}.
   * - Posiada własność {@link DetectorTrait.StrongAccuracy silnej dokładności}.
   * */
  Perfect,
  /** Detektor awarii klasy OP:
   * - Posiada własność {@link DetectorTrait.StrongCompleteness silnej kompletności}.
   * - Posiada własność {@link DetectorTrait.EventualStrongAccuracy ostatecznie silnej dokładności}.
   * */
  EventualPerfect,
  /** Detektor awarii klasy S:
   * - Posiada własność {@link DetectorTrait.StrongCompleteness silnej kompletności}.
   * - Posiada własność {@link DetectorTrait.WeakAccuracy słabej dokładności}.
   * */
  Strong,
  /** Detektor awarii klasy OS:
   * - Posiada własność {@link DetectorTrait.StrongCompleteness silnej kompletności}.
   * - Posiada własność {@link DetectorTrait.EventualWeakAccuracy ostatecznie słabej dokładności}.
   * */
  EventualStrong,
  /** Detektor awarii klasy Q:
   * - Posiada własność {@link DetectorTrait.WeakCompleteness słabej kompletności}.
   * - Posiada własność {@link DetectorTrait.StrongAccuracy silnej dokładności}.
   * */
  QuasiPerfect,
  /** Detektor awarii klasy OQ:
   * - Posiada własność {@link DetectorTrait.WeakCompleteness słabej kompletności}.
   * - Posiada własność {@link DetectorTrait.EventualWeakAccuracy ostatecznie słabej dokładności}.
   * */
  EventualQuasiPerfect,
  /** Detektor awarii klasy W:
   * - Posiada własność {@link DetectorTrait.WeakCompleteness słabej kompletności}.
   * - Posiada własność {@link DetectorTrait.StrongAccuracy silnej dokładności}.
   * */
  Weak,
  /** Detektor awarii klasy OW:
   * - Posiada własność {@link DetectorTrait.WeakCompleteness słabej kompletności}.
   * - Posiada własność {@link DetectorTrait.EventualWeakAccuracy ostatecznie słabej dokładności}.
   * */
  EventualWeak,
  /** Detektor awarii klasy Omega:
   * - Posiada własność ewentualnego wyboru lidera.
   * */
  Omega,
}

export enum ProcessingModel {
  /** Model z jawnymi awariami:
   * - procesy wykonują deterministyczne algorytmy, chyba że zaprzestaną działania w wyniku awarii.
   * - Rozwiązywanie problemów w tym modelu jest stosunkowo łatwe.
   * - Kanały są {@link ChannelType.PerfectLink niezawodne}.
   * - Dostępny {@link DetectorType.Perfect doskonały detektor awarii}.
   **/
  FailStop,
  /** Model z ukrytymi awariami:
   * - procesy wykonują deterministyczne algorytmy, chyba że zaprzestaną działania w wyniku awarii.
   * - Nie ma potrzeby dostępu {@link DetectorType.Perfect doskonały detektor awarii}.
   * - Kanały są {@link ChannelType.PerfectLink niezawodne}.
   * */
  FailSilent,
  /** Model z ostatecznie jawnymi awariami:
   * - procesy wykonują deterministyczne algorytmy, chyba że zaprzestaną działania w wyniku awarii.
   * - Kanały są {@link ChannelType.PerfectLink niezawodne}.
   * - Dostępny {@link DetectorType.EventualPerfect ostatecznie doskonały} albo {@link DetectorType.Omega typu Omega} detektor awarii.
   * */
  FailNoisy,
  /** Model z ostatecznie jawnymi awariami:
   * - procesy wykonują deterministyczne algorytmy, chyba że zaprzestaną działania w wyniku awarii.
   * - po wystąpieniu awarii procesy są wznawiane.
   * - Kanały są {@link ChannelType.Stubborn wytrwałe}.
   * */
  FailRecovery,
  /** Model probabilistyczny:
   * - Procesom udostępniona jest losowa wyrocznia.
   * - Przetwarzanie niedeterministyczne.
   * */
  Randomized,
}

export enum BroadcastType {
  /**
   * Podstawowe rozgłaszanie niezawodne - kontrakty:
   * - Ważność (best-effort validity - własność żywotności) — Jeżeli proces rozsyłający i odbierający jest poprawny, to każda wiadomość jest ostatecznie dostarczona.
   * - Brak powielania (integralność - własność bezpieczeństwa) — Wiadomość jest dostarczona tylko jeden raz.
   * - Brak samo-generacji (zwartość - własność bezpieczeństwa) — Wiadomości są tylko wysyłane przez procesy; nie tworzą się samorzutnie.
   * */
  BestEffort,
  /**
   * Zgodne rozgłaszanie niezawodne — kontrakty:
   * - Ważność (validity — własność żywotności) — Jeżeli proces rozsyłający jest poprawny, to każda wiadomość jest ostatecznie dostarczona.
   * - Brak powielania (integralność — własność bezpieczeństwa) — Wiadomość jest dostarczona tylko jeden raz.
   * - Brak samo-generacji (zwartość — własność bezpieczeństwa) — Wiadomości są tylko wysyłane przez procesy; nie tworzą się samorzutnie.
   * - Zgodność (agreement — własność żywotności) — Jeżeli wiadomość zostanie odebrana przez poprawny process, to ostatecznie wszystkie procesy poprawne odbiorą tę wiadomość.
   * */
  RegularReliable,
  /** Jednolite rozgłaszanie niezawodne — kontrakty:
   * - Ważność (validity — własność żywotności) — Jeżeli proces rozsyłający jest poprawny, to każda wiadomość jest ostatecznie dostarczona.
   * - Brak powielania (integralność — własność bezpieczeństwa) — Wiadomość jest dostarczona tylko jeden raz.
   * - Brak samo-generacji (zwartość — własność bezpieczeństwa) — Wiadomości są tylko wysyłane przez procesy; nie tworzą się samorzutnie.
   * - Jednolita zgodność (uniform agreement — własność żywotności) — Jeżeli wiadomość zostanie odebrana pewien process (niezależnie od poprawności), to ostatecznie wszystkie procesy poprawne odbiorą tę wiadomość.
   */
  UniformReliable,
  /** Probabilistyczne rozgłaszanie niezawodne — kontrakty:
   * - Ważność (probabilistic validity — własność żywotności) — Jeżeli proces rozsyłający jest poprawny, jest pewna określona szansa, że każda wiadomość jest ostatecznie dostarczona.
   * - Brak powielania (integralność — własność bezpieczeństwa) — Wiadomość jest dostarczona tylko jeden raz.
   * - Brak samo-generacji (zwartość — własność bezpieczeństwa) — Wiadomości są tylko wysyłane przez procesy; nie tworzą się samorzutnie.
   */
  ProbabilisticReliable,
}

export enum ConsensusType {
  /**
   * Podstawowy konsensus - kontrakty:
   * - Ważność (validity - własność żywotności) — Jeżeli proces decyduje się na wartość, to została zaproponowana przez pewien proces.
   * - Zakończenie (termination - własność bezpieczeństwa) — Każdy proces ostatecznie decyduje się na jakąś wartość.
   * - Brak powielania (integralność - własność bezpieczeństwa) — Decyzja jest dostarczona tylko jeden raz.
   * - Zgodność (agreement - własność bezpieczeństwa) — Żadne dwa procesy nie decydują się na różne wartości.
   * */
  Regular,
}

export enum ChannelType {
  /** Kanał rzetelny - kontrakty:
   * - Rzetelne Dostarczanie (własność żywotności) — Wiadomość wysłana nieskończoność razy będzie dostarczona nieskończoną liczbę razy, jeżeli oba procesy są poprawne.
   * - Ograniczone Dostarczanie (własność bezpieczeństwa) — Skończona ilość wiadomości jest dostarczona skończoną ilość razy.
   * - Brak samo-generacji (własność bezpieczeństwa) — Wiadomości są tylko wysyłane przez procesy; nie tworzą się samorzutnie.
   * */
  FairLoss,
  /** Kanał wytrwały - kontrakty:
   * - Wytrwałe Dostarczanie (własność żywotności) — Wiadomość raz wysłana będzie dostarczona nieskończoną liczbę razy, jeżeli oba procesy są poprawne.
   * - Brak samo-generacji (własność bezpieczeństwa) — Wiadomości są tylko wysyłane przez procesy; nie tworzą się samorzutnie.
   * */
  Stubborn,
  /** Kanał niezawodny - kontrakty:
   * - Niezawodne Dostarczanie (własność żywotności) — Wiadomość raz wysłana będzie ostatecznie dostarczona, jeżeli oba procesy są poprawne.
   * - Brak powielania (własność bezpieczeństwa) — Wiadomość jest dostarczana tylko raz.
   * - Brak samo-generacji (własność bezpieczeństwa) — Wiadomości są tylko wysyłane przez procesy; nie tworzą się samorzutnie.
   * */
  PerfectLink,
}

export enum FlushType {
  /** Kanał niewyprzedzający oraz blokujący wyprzedzanie */
  TwoWay = "TF",
  /** Kanał niewyprzedzający */
  Forward = "FF",
  /** Kanał blokujący wyprzedzanie */
  Backward = "BF",
  /** Kanał bez blokad */
  Ordinary = "OF",
}
export module FlushType {
  const { Backward, Ordinary, Forward, TwoWay } = FlushType;

  export const isNonForwardable = (flushType: FlushType) =>
    [TwoWay, Forward].includes(flushType);
  export const isNonBackwardable = (flushType: FlushType) =>
    [Ordinary, Backward].includes(flushType);
}

export enum ComplexityType {
  /** Złożoność komunikacyjna:
   * - Liczba pakietów/wiadomości wysyłanych w trakcie działania algorytmu.
   * - Sumaryczna liczba wiadomości/długość bitowa wiadomości wysyłanych w trakcie działania algorytmu.
   * */
  Communication,
  /** Złożoność czasowa — liczba kroków do zakończenia:
   * - Czas wykonywania każdego kroku jest stały (pomijalny).
   * - Kroki wykonywane są synchronicznie.
   * - Czas transmisji wiadomości jest stały (jednostkowy).
   * */
  Time,
}

export class ScalarClock {
  constructor(public value: number = 0) {}

  tick = () => (++this.value, this);
  sync = (other: this) => (
    (this.value = Math.max(this.value, other.value) + 1), this
  );
}

export class VectorClock extends Array<number> {
  tickAt = (index: number) => (++this[index], this);
  sync = (other: VectorClock) => (
    this.forEach((tick, index) => (this[index] = Math.max(tick, other[index]))),
      this
  );

  isSameAs = (other: VectorClock) =>
    this.every((tick, index) => tick === other[index]);
  isNotSameAs = (other: VectorClock) =>
    this.some((tick, index) => tick !== other[index]);

  isEarlierOrSameAs = (other: VectorClock) =>
    this.every((tick, index) => tick <= other[index]);
  isNotEarlierOrSameAs = (other: VectorClock) =>
    this.some((tick, index) => tick > other[index]);
  isEarlierThan = (other: VectorClock) =>
    this.isEarlierOrSameAs(other) && this.isNotSameAs(other);
  isNotEarlierThan = (other: VectorClock) => !this.isEarlierThan(other);

  isLaterThan = (other: VectorClock) => this.isNotEarlierOrSameAs(other);
  isNotLaterThan = (other: VectorClock) => !this.isLaterThan(other);
  isLaterOrSameAs = (other: VectorClock) => this.isNotEarlierThan(other);
  isNotLaterOrSameAs = (other: VectorClock) => !this.isLaterOrSameAs(other);

  isIncomperableWith = (other: VectorClock) =>
    this.isNotEarlierThan(other) && other.isNotEarlierThan(this);
}

export enum ListenerType {
  Recover,
  SideEffect,
  Crash,
  Clock,
  Start,
  Internal,
  Activation,
  Receive,
  Send,
  /** @see BroadcastType.BestEffort */
  SendBestEffortBroadcast,
  /** @see BroadcastType.RegularReliable */
  SendReliableRegularBroadcast,
  /** @see BroadcastType.UniformReliable */
  SendUniformReliableBroadcast,
  /** @see ChannelType.FairLoss */
  SendFairLoss,
  /** @see ChannelType.Stubborn */
  SendStubborn,
  /** @see ChannelType.PerfectLink */
  SendPerfectLink,
  /** @see FlushType.Forward */
  SendForward,
  /** @see FlushType.Backward */
  SendBackward,
  /** @see FlushType.Ordinary */
  SendOrdinary,
  /** @see FlushType.TwoWay */
  SendTwoWay,
  /** @see FlushType */
  SendX,
  /** @see ChannelType.FairLoss */
  ReceiveFairLoss,
  /** @see ChannelType.Stubborn */
  ReceiveStubborn,
  /** @see ChannelType.PerfectLink */
  ReceivePerfectLink,
  /** @see BroadcastType.BestEffort */
  ReceiveBestEffortBroadcast,
  /** @see BroadcastType.RegularReliable */
  ReceiveReliableRegularBroadcast,
  /** @see BroadcastType.UniformReliable */
  DeliverUniformReliableBroadcast,
  /** @see ChannelType.FairLoss */
  DeliverFairLoss,
  /** @see ChannelType.Stubborn */
  DeliverStubborn,
  /** @see ChannelType.PerfectLink */
  DeliverPerfectLink,
  /** @see BroadcastType.BestEffort */
  DeliverBestEffortBroadcast,
  /** @see BroadcastType.ProbabilisticReliable */
  DeliverProbabilisticReliableBroadcast,
  /** @see BroadcastType.ProbabilisticReliable */
  ReceiveProbabilisticReliableBroadcast,
  /** @see BroadcastType.ProbabilisticReliable */
  SendProbabilisticReliableBroadcast,
  /** @see ConsensusType.Regular */
  ProposeRegular,
  /** @see ConsensusType.Regular */
  DecideRegular,
}

export const {
  DecideRegular,
  Send,
  Crash,
  DeliverFairLoss,
  DeliverStubborn,
  DeliverPerfectLink,
  SendFairLoss,
  SendStubborn,
  SendPerfectLink,
  SendForward,
  DeliverUniformReliableBroadcast,
  DeliverProbabilisticReliableBroadcast,
  ReceiveProbabilisticReliableBroadcast,
  SendProbabilisticReliableBroadcast,
  ProposeRegular,
  SendBackward,
  SendOrdinary,
  SendTwoWay,
  SendBestEffortBroadcast,
  SendReliableRegularBroadcast,
  SendX,
  Receive,
  ReceiveFairLoss,
  SendUniformReliableBroadcast,
  SideEffect,
  ReceiveStubborn,
  ReceivePerfectLink,
  ReceiveReliableRegularBroadcast,
  DeliverBestEffortBroadcast,
  Start,
  Internal,
  Activation,
  Clock,
  Recover,
  ReceiveBestEffortBroadcast,
} = ListenerType;