/**
 * Dowód - Udowodnij:
 * - Czy Algorytm aktywnego rozgłoszenia niezawodnego jest poprawny oraz pokaż, że algorytm
 * nie spełnia jednolitego rozgłaszania.
 *
 * Założenia:
 * - Niezawodne kanały FIFO.
 * - Doskonały detektor awarii.
 *
 * Definicja rozgłaszania niezawodnego:
 * - Kontrakty:
 * - Ważność (Własność żywotności).
 * - Brak duplikacji (Własność bezpieczeństwa).
 * - Brak samo-generacji (Własność bezpieczeństwa).
 * - Zgodność (Własność żywotności).
 * Definicja rozgłaszania jednolitego:
 * - Kontrakty:
 * - Ważność (Własność żywotności).
 * - Brak duplikacji (Własność bezpieczeństwa).
 * - Brak samo-generacji (Własność bezpieczeństwa).
 * - Jednolita zgodność (Własność żywotności) -
 * Różni się od zgodności rozgłaszania niezawodnego tym, że wiadomość odebrana przez nieważne od poprawności proces
 * też jest dostarczana do każdego poprawnego procesu.
 *
 *
 * Dowód:
 * - Algorytm spełnia:
 * - Ważność (Własność żywotności) ...
 * - Brak duplikacji (Własność bezpieczeństwa) ...
 * - Brak samo-generacji (Własność bezpieczeństwa) ...
 * - Zgodność (Własność żywotności) ...
 * - Co należało dowieść.
 * Dowód niespełnienia założeń jednolitego rozgłaszania:
 * - własność jednolitej zgodności jest pogwałcone przez brak dostarczenia wiadomości przy niepoprawnym procesie.
 * - Hipotetyczna sytuacja: 3 procesy, 2 poprawne i 1 ulegający awarii. Ulegający zdążył wysłać wiadomość do procesu 2.
 * i zdążył odebrać wiadomość, ale po odebraniu następuje awaria i nie przesyła dalej wiadomości.
 * Wiadomość mimo odebrania nie jest przesłana dalej, co powoduje, że nie jest dostarczona do procesu 3.
 */
