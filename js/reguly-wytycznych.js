/*
 * Reguly wyznaczania wytycznych na podstawie dwoch ocen w skali 1..5
 * (js/skala.js: 1 - bardzo dobry ... 5 - krytyczny / ruina):
 *   z    - stan zachowania (null = "Brak oceny")
 *   t    - stan techniczny (null = "Brak oceny")
 *   suma - z + t (2..10); liczona tylko, gdy oba stany sa ocenione
 *
 * Reguly sprawdzane sa po kolei - obowiazuje PIERWSZA spelniona.
 * Warunek (osobno dla z, t i suma):
 *   [min, max] - zakres (wlacznie)
 *   null       - "Brak oceny" (tylko z i t)
 *   pominiety  - dowolna wartosc
 * kod       - oznaczenie wytycznej w tabeli (W1..W5)
 * priorytet - kolejnosc sortowania i kolor oznaczenia: 1 = najpilniejsze; null = brak wytycznej
 */
window.REGULY_WYTYCZNYCH = [
  { z: null, tekst: 'Uzupełnić brakującą ocenę (stan zachowania lub techniczny)', priorytet: null },
  { t: null, tekst: 'Uzupełnić brakującą ocenę (stan zachowania lub techniczny)', priorytet: null },

  { suma: [9, 10], kod: 'W5', tekst: 'Natychmiastowa rekonstrukcja', priorytet: 1 },
  { suma: [7, 8], kod: 'W4', tekst: 'Naprawa lub wymiana elementu', priorytet: 2 },
  { suma: [5, 6], kod: 'W3', tekst: 'Konserwacja z uzupełnieniem rozległych ubytków', priorytet: 3 },
  { suma: [3, 4], kod: 'W2', tekst: 'Konserwacja z uzupełnieniem drobnych ubytków', priorytet: 4 },
  { suma: [2, 2], kod: 'W1', tekst: 'Konserwacja z minimalną ingerencją', priorytet: 5 },
];
