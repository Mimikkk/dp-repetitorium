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
   * - Brak ogranicze?? na czas komunikacj??.
   * - Brak ogranicze?? na czas przetwarzania.
   * - Brak dost??pu do globalnego zegara.
   * */
  Asynchronous,
  /**
   * Cechy systemu:
   * - Synchroniczna komunikacja.
   * - Synchroniczne przetwarzania.
   * - Dost??pu do globalnego zegara.
   * */
  Synchronous,
  /**
   * Cechy systemu:
   * - Znane maksymalne czasy komunikacji/przetwarzania, lecz nie jest znany moment, po kt??rym zaczn?? one obowi??zywa??.
   * - Istniej?? pewne odcinki czasu, w kt??rych system dzia??a asynchronicznie.
   * - Zwykle zachowuje si?? w spos??b synchroniczny.
   * */
  Hybrid,
}

export enum SystemProperty {
  /** W??a??ciwo???? bezpiecze??stwa ( safety/consistency ):
   * - Nie dopuszcza do niepo????danego stanu.
   * - Zawsze proces jest utrzymany w stanie po????danym.
   * - Ewentualnie nie dzieje si?? nic z??ego.
   * np.: Nigdy 2 procesy nie b??d?? w sekcji krytycznej.
   * */
  Safety,
  /** W??a??ciwo???? ??ywotno??ci - post??pu ( liveness/progress ):
   * - Pozwala na ostateczne osi??gni??cie stanu po????danego.
   * - Ewentualnie dzieje si?? co?? dobrego.
   * np.: procesy ostatecznie dotr?? do swoich sekcji krytycznych.
   * */
  Liveness,
}

export enum DetectorTrait {
  /** Zdolno???? do podejrzewania wszystkich proces??w niepoprawnych. */
  Completeness,
  /** {@link DetectorTrait.Completeness Kompletno????} - Ostatecznie ka??dy proces niepoprawny b??dzie trwale podejrzewany przez niekt??re procesy poprawne. */
  WeakCompleteness,
  /** {@link DetectorTrait.Completeness Kompletno????} - Ostatecznie ka??dy proces niepoprawny b??dzie trwale podejrzewany przez wszystkie procesy poprawne. */
  StrongCompleteness,
  /** Zdolno???? do niepodejrzewania proces??w poprawnych. */
  Accuracy,
  /** {@link DetectorTrait.Accuracy Dok??adno????} - ??aden proces nie jest podejrzewany, dop??ki nie stanie si?? niepoprawny. */
  StrongAccuracy,
  /** {@link DetectorTrait.Accuracy Dok??adno????} - Czasem proces jest podejrzewany, mimo poprawno??ci. */
  WeakAccuracy,
  /** {@link DetectorTrait.Accuracy Dok??adno????} - Po pewnym czasie wszystkie podejrzewane procesy poprawne, przestan?? by?? podejrzewane przez wszystkie procesy poprawne. Zapewnia w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}. */
  EventualStrongAccuracy,
  /** {@link DetectorTrait.Accuracy Dok??adno????} - Po pewnym czasie niekt??re podejrzewane procesy poprawne, przestan?? by?? podejrzewane przez niekt??re procesy poprawne. Zapewnia w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}. */
  EventualWeakAccuracy,
}

export enum DetectorType {
  /** Detektor awarii klasy P:
   * - Posiada w??asno???? {@link DetectorTrait.StrongCompleteness silnej kompletno??ci}.
   * - Posiada w??asno???? {@link DetectorTrait.StrongAccuracy silnej dok??adno??ci}.
   * */
  Perfect,
  /** Detektor awarii klasy OP:
   * - Posiada w??asno???? {@link DetectorTrait.StrongCompleteness silnej kompletno??ci}.
   * - Posiada w??asno???? {@link DetectorTrait.EventualStrongAccuracy ostatecznie silnej dok??adno??ci}.
   * */
  EventualPerfect,
  /** Detektor awarii klasy S:
   * - Posiada w??asno???? {@link DetectorTrait.StrongCompleteness silnej kompletno??ci}.
   * - Posiada w??asno???? {@link DetectorTrait.WeakAccuracy s??abej dok??adno??ci}.
   * */
  Strong,
  /** Detektor awarii klasy OS:
   * - Posiada w??asno???? {@link DetectorTrait.StrongCompleteness silnej kompletno??ci}.
   * - Posiada w??asno???? {@link DetectorTrait.EventualWeakAccuracy ostatecznie s??abej dok??adno??ci}.
   * */
  EventualStrong,
  /** Detektor awarii klasy Q:
   * - Posiada w??asno???? {@link DetectorTrait.WeakCompleteness s??abej kompletno??ci}.
   * - Posiada w??asno???? {@link DetectorTrait.StrongAccuracy silnej dok??adno??ci}.
   * */
  QuasiPerfect,
  /** Detektor awarii klasy OQ:
   * - Posiada w??asno???? {@link DetectorTrait.WeakCompleteness s??abej kompletno??ci}.
   * - Posiada w??asno???? {@link DetectorTrait.EventualWeakAccuracy ostatecznie s??abej dok??adno??ci}.
   * */
  EventualQuasiPerfect,
  /** Detektor awarii klasy W:
   * - Posiada w??asno???? {@link DetectorTrait.WeakCompleteness s??abej kompletno??ci}.
   * - Posiada w??asno???? {@link DetectorTrait.StrongAccuracy silnej dok??adno??ci}.
   * */
  Weak,
  /** Detektor awarii klasy OW:
   * - Posiada w??asno???? {@link DetectorTrait.WeakCompleteness s??abej kompletno??ci}.
   * - Posiada w??asno???? {@link DetectorTrait.EventualWeakAccuracy ostatecznie s??abej dok??adno??ci}.
   * */
  EventualWeak,
  /** Detektor awarii klasy Omega:
   * - Posiada w??asno???? ewentualnego wyboru lidera.
   * */
  Omega,
}

export enum ProcessingModel {
  /** Model z jawnymi awariami:
   * - procesy wykonuj?? deterministyczne algorytmy, chyba ??e zaprzestan?? dzia??ania w wyniku awarii.
   * - Rozwi??zywanie problem??w w tym modelu jest stosunkowo ??atwe.
   * - Kana??y s?? {@link ChannelType.PerfectLink niezawodne}.
   * - Dost??pny {@link DetectorType.Perfect doskona??y detektor awarii}.
   **/
  FailStop,
  /** Model z ukrytymi awariami:
   * - procesy wykonuj?? deterministyczne algorytmy, chyba ??e zaprzestan?? dzia??ania w wyniku awarii.
   * - Nie ma potrzeby dost??pu {@link DetectorType.Perfect doskona??y detektor awarii}.
   * - Kana??y s?? {@link ChannelType.PerfectLink niezawodne}.
   * */
  FailSilent,
  /** Model z ostatecznie jawnymi awariami:
   * - procesy wykonuj?? deterministyczne algorytmy, chyba ??e zaprzestan?? dzia??ania w wyniku awarii.
   * - Kana??y s?? {@link ChannelType.PerfectLink niezawodne}.
   * - Dost??pny {@link DetectorType.EventualPerfect ostatecznie doskona??y} albo {@link DetectorType.Omega typu Omega} detektor awarii.
   * */
  FailNoisy,
  /** Model z ostatecznie jawnymi awariami:
   * - procesy wykonuj?? deterministyczne algorytmy, chyba ??e zaprzestan?? dzia??ania w wyniku awarii.
   * - po wyst??pieniu awarii procesy s?? wznawiane.
   * - Kana??y s?? {@link ChannelType.Stubborn wytrwa??e}.
   * */
  FailRecovery,
  /** Model probabilistyczny:
   * - Procesom udost??pniona jest losowa wyrocznia.
   * - Przetwarzanie niedeterministyczne.
   * */
  Randomized,
}

export enum BroadcastType {
  /**
   * Podstawowe rozg??aszanie niezawodne - kontrakty:
   * - Wa??no???? (best-effort validity - w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}) ??? Je??eli proces rozsy??aj??cy i odbieraj??cy jest poprawny, to ka??da wiadomo???? jest ostatecznie dostarczona.
   * - Brak powielania (integralno???? - w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo???? jest dostarczona tylko jeden raz.
   * - Brak samo-generacji (zwarto???? - w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo??ci s?? tylko wysy??ane przez procesy; nie tworz?? si?? samorzutnie.
   * */
  BestEffort,
  /**
   * Zgodne rozg??aszanie niezawodne ??? kontrakty:
   * - Wa??no???? (validity ??? w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}) ??? Je??eli proces rozsy??aj??cy jest poprawny, to ka??da wiadomo???? jest ostatecznie dostarczona.
   * - Brak powielania (integralno???? ??? w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo???? jest dostarczona tylko jeden raz.
   * - Brak samo-generacji (zwarto???? ??? w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo??ci s?? tylko wysy??ane przez procesy; nie tworz?? si?? samorzutnie.
   * - Zgodno???? (agreement ??? w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}) ??? Je??eli wiadomo???? zostanie odebrana przez poprawny process, to ostatecznie wszystkie procesy poprawne odbior?? t?? wiadomo????.
   * */
  RegularReliable,
  /** Jednolite rozg??aszanie niezawodne ??? kontrakty:
   * - Wa??no???? (validity ??? w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}) ??? Je??eli proces rozsy??aj??cy jest poprawny, to ka??da wiadomo???? jest ostatecznie dostarczona.
   * - Brak powielania (integralno???? ??? w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo???? jest dostarczona tylko jeden raz.
   * - Brak samo-generacji (zwarto???? ??? w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo??ci s?? tylko wysy??ane przez procesy; nie tworz?? si?? samorzutnie.
   * - Jednolita zgodno???? (uniform agreement ??? w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}) ??? Je??eli wiadomo???? zostanie odebrana pewien process (niezale??nie od poprawno??ci), to ostatecznie wszystkie procesy poprawne odbior?? t?? wiadomo????.
   */
  UniformReliable,
  /** Probabilistyczne rozg??aszanie niezawodne ??? kontrakty:
   * - Wa??no???? (probabilistic validity ??? w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}) ??? Je??eli proces rozsy??aj??cy jest poprawny, jest pewna okre??lona szansa, ??e ka??da wiadomo???? jest ostatecznie dostarczona.
   * - Brak powielania (integralno???? ??? w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo???? jest dostarczona tylko jeden raz.
   * - Brak samo-generacji (zwarto???? ??? w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo??ci s?? tylko wysy??ane przez procesy; nie tworz?? si?? samorzutnie.
   */
  ProbabilisticReliable,
}

export enum ConsensusType {
  /**
   * Podstawowy konsensus - kontrakty:
   * - Wa??no???? (validity - w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}) ??? Je??eli proces decyduje si?? na warto????, to zosta??a zaproponowana przez pewien proces.
   * - Zako??czenie (termination - w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Ka??dy proces ostatecznie decyduje si?? na jak???? warto????.
   * - Brak powielania (integralno???? - w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Decyzja jest dostarczona tylko jeden raz.
   * - Zgodno???? (agreement - w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? ??adne dwa procesy nie decyduj?? si?? na r????ne warto??ci.
   * */
  Regular,
}

export enum ChannelType {
  /** Kana?? rzetelny - kontrakty:
   * - Rzetelne Dostarczanie (w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}) ??? Wiadomo???? wys??ana niesko??czono???? razy b??dzie dostarczona niesko??czon?? liczb?? razy, je??eli oba procesy s?? poprawne.
   * - Ograniczone Dostarczanie (w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Sko??czona ilo???? wiadomo??ci jest dostarczona sko??czon?? ilo???? razy.
   * - Brak samo-generacji (w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo??ci s?? tylko wysy??ane przez procesy; nie tworz?? si?? samorzutnie.
   * */
  FairLoss,
  /** Kana?? wytrwa??y - kontrakty:
   * - Wytrwa??e Dostarczanie (w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}) ??? Wiadomo???? raz wys??ana b??dzie dostarczona niesko??czon?? liczb?? razy, je??eli oba procesy s?? poprawne.
   * - Brak samo-generacji (w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo??ci s?? tylko wysy??ane przez procesy; nie tworz?? si?? samorzutnie.
   * */
  Stubborn,
  /** Kana?? niezawodny - kontrakty:
   * - Niezawodne Dostarczanie (w??asno???? {@link SystemProperty.Liveness ??ywotno??ci}) ??? Wiadomo???? raz wys??ana b??dzie ostatecznie dostarczona, je??eli oba procesy s?? poprawne.
   * - Brak powielania (w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo???? jest dostarczana tylko raz.
   * - Brak samo-generacji (w??asno???? {@link SystemProperty.Safety bezpiecze??stwa}) ??? Wiadomo??ci s?? tylko wysy??ane przez procesy; nie tworz?? si?? samorzutnie.
   * */
  PerfectLink,
}

export enum FlushType {
  /** Kana?? niewyprzedzaj??cy oraz blokuj??cy wyprzedzanie
   * Inaczej FIFO
   * */
  TwoWay = "TF",
  /** Kana?? niewyprzedzaj??cy */
  Forward = "FF",
  /** Kana?? blokuj??cy wyprzedzanie */
  Backward = "BF",
  /** Kana?? bez blokad
   *  Inaczej nonFIFO
   * */
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
  /** Z??o??ono???? komunikacyjna:
   * - Liczba pakiet??w/wiadomo??ci wysy??anych w trakcie dzia??ania algorytmu.
   * - Sumaryczna liczba wiadomo??ci/d??ugo???? bitowa wiadomo??ci wysy??anych w trakcie dzia??ania algorytmu.
   * */
  Communication,
  /** Z??o??ono???? czasowa ??? liczba krok??w do zako??czenia:
   * - Czas wykonywania ka??dego kroku jest sta??y (pomijalny).
   * - Kroki wykonywane s?? synchronicznie.
   * - Czas transmisji wiadomo??ci jest sta??y (jednostkowy).
   * */
  Time,
}

export class ScalarClock {
  constructor(public value: number = 0) {}

  tick = () => (++this.value, this);
  sync = (other: this) =>
    (this.value = Math.max(this.value, other.value), this);
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