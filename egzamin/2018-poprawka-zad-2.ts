/**
 * Wyznacz dokładną złożoność czasową i komunikacyjną:
 * - Algorytm wektorowy Mattern'a wyznaczania stanu spójnego.
 *
 * Założenia:
 * - Połączenie pierścienia logicznego.
 * - Liczymy przesyłanie wiadomości między procesami.
 *
 * Uzasadnienie:
 * - Początkowo jest wysyłana wiadomości rozpoczynająca detekcję zakończenia z licznikiem wektorowym różnic wysłanych i otrzymanych wiadomości w procesach przesyłana później w 2 cyklach
 * do następców, aż wróci do początkowego monitora. Jeżeli ostatecznie sumy różnic są równe 0. To oznacza zakończenie, co daje nam
 * 2d kroków, gdzie d jest rozpiętością grafu, a wiadomości jest 2m plus koszt przesłań między procesami, które sumują się do 2*(n + n-1 + n-2...1), gdzie m to liczba procesów.
 *
 * Złożoność czasowa: 2d
 *
 * Złożoność komunikacyjna: 2n + 2*(n + n-1 + n-2...1) = 2n + 2n(n+1)/2 = n(2 + (n+1))
 */
