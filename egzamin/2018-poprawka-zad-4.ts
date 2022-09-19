/**
 * Dowód - Udowodnij:
 * - Algorytm detekcji zakończenia statycznego będzie poprawny.
 *
 * Założenia:
 * - Procesy bezawaryjne.
 * - Kanały niezawodne FIFO.
 * - Topologia w pełni połączona.
 * - Detekcja statyczna, gdy nie ma już przesyłanych wiadomości w kanałach oraz nie ma już wiadomości, które podnoszą
 * proces ze stanu pasywnego.
 *
 * Dowód:
 * 1. Algorytm działa w dwóch fazach, gdzie w pierwszej kolejności rozsyła zapytania do wszystkich
 * monitorów i w drugiej fazie odbiera odpowiedzi od monitorów. Gdy wszystkie odpowiedzi wykażą, że
 * proces nie był aktywny przez 2 cykle algorytmu, to jest on zakończony.
 * 2. Proces zapytany oczekuje swojej pasywności oraz na licznik potwierdzonych wiadomości by był równy zero, co oznacza
 * zgodnie z kanałami niezawodnymi fifo, że nie ma już wiadomości w kanałach w stanie in-transit. Dodatkowo proces jeszcze oczekuje na brak aktywności w kanałach, aby zagwarantować, że
 * żadna dostępna wiadomość, go nie pobudzi do stanu aktywnego.
 * Po udanym oczekiwaniu proces zwraca odpowiedź ze swoim stanem do inicjatora i proces oznacza się jako pasywny.
 * 3. Po odbyciu 2 cykli bez aktywności procesu proces wysyła informacje z ciągłą pasywnością, na co oczekuję inicjator.
 * Jeżeli każdy proces zwróci wiadomość to oznacza, że żaden kanał in-transit nie zawiera wiadomości oraz, żadna dostępna
 * wiadomość nie jest w stanie podnieść stanu do aktywnego procesów, co jest definicją detekcji zakończenia statycznego. Co należało udowodnić.
 * */
