/**
 * Dowód - Udowodnij:
 * - Algorytm aktywnego rozgłaszania zgodnego będzie poprawny.
 *
 * Założenia:
 * - System hybrydowy.
 * - Czasy przesłania są skończone, ale nieznane.
 * - Czasy przetwarzania są skończone, ale nieznane.
 * - Kanały niezawodne FIFO.
 * - Procesy są awaryjne.
 *
 *
 * Dowód:
 * - Rozgłaszanie zgodne wymaga spełnienia 4 właściwości:
 *   - ważność: (własność żywotności) — Algorytm rozsyła przez kanały niezawodne wszystkim monitorom wiadomość,
 *   która jeżeli nie została jeszcze dostarczona, to zostaje dostarczana i od razu rozesłana do każdego innego znanego procesu i dodana do zbioru wiadomości dosłanych.
 *   Co gwarantuje nam ewentualne dostarczenie każdej wiadomości do każdego procesu.
 *   A w wypadku awarii procesu przed wysłaniem do nikogo wiadomości to wszystkie wiadomości wysłane przez poprawne procesy jest nadal spełniony.
 *   Jeżeli proces poddał się awarii po rozpoczęciu rozsyłania wiadomości i zdążył wysłać wiadomość od jednego z procesów to ten rozpropaguje tę informację do reszty poprawnych procesów.
 *   - Brak duplikacji: (własność bezpieczeństwa) — Gwarancję tą daje algorytm, który zapewnia
 *   dostarczenie jednorazowe każdej wiadomości na podstawie przetrzymywanego zbioru zebranych wiadomości.
 *   - Brak samo-generacji: (własność bezpieczeństwa) — Kanały niezawodne mają gwarancje
 *   braku występowania samo-generacji.
 *   - Zgodność: (własność żywotności) — Gwarancję daje nam na podstawie dodatkowych rozesłań, co było opisane we
 *   własności żywotności.
 * - Algorytm mimo awarii potrafi zagwarantować, wyżej przedstawione założenia, co dowodzi poprawności aktywnego rozgłaszania.
 */
