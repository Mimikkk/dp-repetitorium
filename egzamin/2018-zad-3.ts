/**
 * Złożoność komunikacyjna i czasowa algorytmu:
 * - Algorytm jednofazowej detekcji zakończenia.
 * - Połączenie pierścieniowe.
 *
 * Wyjaśnienie:
 * - Algorytm zlicza różnicę wysłanych i odebranych wiadomości w każdym procesie po kolei w pierścieniu.
 * - Jeżeli dojdzie wiadomość z różnicą do początkowego monitora i różnica będzie równa 0, to znaczy, że wszystkie procesy zakończyły działanie co daje nam n kroków i n wiadomości.
 *
 * Złożoność komunikacyjna:
 * - 2m zależy od liczby procesów w pierścieniu.
 * Złożoność czasowa:
 * - d. Rozpiętość grafu.
 */
