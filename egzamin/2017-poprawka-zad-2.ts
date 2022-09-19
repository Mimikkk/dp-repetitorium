/**
 * Dowód - Udowodnij:
 * - Czy Algorytm Dijkstry, Feijena, van Gasterna będzie poprawnie wykonywał detekcję zakończenia statycznego.
 *
 * Założenia:
 * - Połączenie pierścienia logicznego.
 * - Kanały FIFO.
 *
 * Definicja zakończenia statycznego:
 * - Zakończenie statyczne występuje, gdy żaden proces nie zawiera w kanałach wiadomości przychodzących, oraz, żadna
 * z dostępnych wiadomości nie jest w stanie aktywować procesu, podnosząc go ze stanu pasywnego.
 *
 * Dowód:
 * - Algorytm oczekuje przed inicjalizacją właściwą, oczekuję na własną pasywność, po czym przesyła
 * informacje następcę o sprawdzaniu wystąpienia zakończenia poprzez wysłanie białego znacznika, który
 * staje się zabarwiony, gdy przejdzie przez proces zabarwiony. Proces jest zabarwiony, gdy wyśle wiadomość do wcześniejszego niż on w okręgu procesu.
 * Następca oczekuje na własną pasywność, po czym przesyła do następcy.
 * Jeżeli token w trakcie kolejki nie zmienił koloru, oznacza to zakończenie, na podstawie wcześniejszego oczekiwania
 * na pasywność. Proces oznaczony jako pasywny nie wysyła już wiadomości, a przez to, że każdy proces
 * wcześniejszy jest również aktywny, gwarantujemy, że żadna wiadomość nie jest w trybie in-transit, ani nie jest wysłana
 * do następców. To wszystko mówi nam, że nasze procesy nie mają wiadomości w kanałach w trybie in-transit, ani, żadna
 * otrzymana wiadomość nie jest w stanie aktywować procesu oraz poprzez oczekiwanie na pasywność, oraz brak zabarwienia znacznika
 * wiemy, że proces nie zamierza wysłać żadnej wiadomości, co jest definicją statycznej detekcji zakończenia co należalo udowodnić.
 *
 */
