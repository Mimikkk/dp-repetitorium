/**
 * Dowód - udowodnij:
 * - Mając algorytm korzystający z kanałów nonFIFO, wykaż, że stosując kanały FC, algorytm zachowa swoją poprawność.
 *
 * Założenia:
 * - Kanały FC mogą wyprzedzać wiadomości z ewentualną blokowaniem wyprzedzania do przodu lub do tyłu.
 * - Kanały nonFIFO mogą wyprzedzać wiadomości z brakiem blokowaniem wyprzedzania do przodu lub do tyłu.
 *
 * Dowód:
 * - Kanały nonFIFO są podzbiorem kanałów FC, ponieważ kanały FC mogą mieć dodatkowe blokady, a nonFIFO zakłada ich brak.
 * - Jeżeli mamy algorytm, który działa poprawnie na kanałach nonFIFO, które nie mają dodatkowych założeń,
 * to ten zadziała działa poprawnie na kanałach FC, które zakładają dodatkowe założenia.
 */
