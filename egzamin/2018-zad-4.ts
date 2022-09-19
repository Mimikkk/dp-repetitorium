/**
 * Dowód - udowodnij:
 * - Jeśli każdy proces ma równą wartość zegara Lamport'a, to konfiguracja jest spójna.
 *
 * Założenia:
 * - konfiguracja jest spójna, jeżeli stany lokalne składowe są osiągalne w każdym kroku czasowym.
 *
 * Dowód:
 * 1. Każdy proces ma równą wartość zegara.
 * 2. Zdarzenia inne muszą mieć wartości zegara mniejszą niż ostatnie wydarzenia w linii czasowej procesu.
 * 3. Z relacji między zbiorem zdarzeń a wartości zegara skalarnego wiemy,
 * że jeżeli wartości zegarów są równe, to zdarzenia są niezależne, a jeżeli są mniejsze to zdarzenia, są następstwami.
 * 4. Z definicji konfiguracji spójnej wiemy, że wszystkie stany lokalne są osiągalne, ponieważ każde następstwo jest zawarte w zbiorze zdarzeń.
 * - zgodnie z 4. konfiguracja jest spójna — co było trzeba udowodnić.
 */
