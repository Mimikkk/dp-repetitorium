/**
 * - Skoro doskonały detektor wykrywa błędne procesy _ostatecznie_, a nie od razu, to algorytm nie zabezpieczał przed przypadkiem, w którym proces przesyłałby znacznik do innego, który już uległ awarii, ale nie został jeszcze uznany za niepoprawny.
 * - Proces po otrzymaniu znacznika mógł ulec awarii (detektory nie przewidują przyszłości). W obu przypadkach mielibyśmy zaginięcie znacznika i brak postępu.
 * - Proces mógł przesyłać/odbierać wiadomości i ulec awarii, w wyniku czego jego liczniki nie byłyby uwzględnione w ostatecznej sumie zbieranej przez znacznik. Można to było wykorzystać zarówno do pokazania naruszenie bezpieczeństwa (suma liczników = 0 mimo, że są wiadomości w kanale), jak i żywotności (suma liczników już zawsze pozostanie różna od zera, mimo pustych kanałów).
 * - Zakończenie nie musi być wykryte od razu, ale _ostatecznie_ - w dowodzie ważne jest więc, by wspomnieć, że _nigdy_ ta suma już się nie zmieni i że algorytm będzie powtarzał iteracje w nieskończoność. Jeżeli ktoś zapomniał o tym wspomnieć, odejmowałem na razie pół punkta, ale być może jeszcze wrócę do tych prac i skoryguję punktację w górę./
 */
