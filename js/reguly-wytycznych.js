/*
 * Reguly wyznaczania wytycznych na podstawie dwoch ocen w tej samej skali 1..5
 * (js/skala.js: 1 - bardzo dobry ... 5 - krytyczny / ruina):
 *   z - stan zachowania (null = "Brak oceny")
 *   t - stan techniczny (null = "Brak oceny")
 *
 * Reguly sprawdzane sa po kolei - obowiazuje PIERWSZA spelniona.
 * Warunek (osobno dla z i t):
 *   [min, max] - zakres oceny (wlacznie)
 *   null       - "Brak oceny"
 *   pominiety  - dowolna ocena
 * priorytet: 1 (najpilniejsze) .. 5; null = brak wytycznej (brakuje oceny)
 *
 * 5 wytycznych - decyduje gorsza z dwoch ocen:
 *   W1 (P1) ocena 5 w ktorymkolwiek stanie
 *   W2 (P2) stan techniczny 4
 *   W3 (P3) stan zachowania 4 (technicznie co najmniej srednio)
 *   W4 (P4) stan zachowania 3 (technicznie co najmniej srednio)
 *   W5 (P5) stan zachowania 1-2 (technicznie co najmniej srednio)
 */
(() => {
const W1 = 'Prace ratunkowe: natychmiastowe zabezpieczenie doraźne, dokumentacja reliktów, następnie rekonstrukcja lub wymiana elementu';
const W2 = 'Naprawa konstrukcyjna (wzmocnienie, przemurowanie, wymiana zniszczonych partii) oraz konserwacja z uzupełnieniem ubytków';
const W3 = 'Konserwacja z uzupełnieniem rozległych ubytków, bez ingerencji konstrukcyjnej';
const W4 = 'Konserwacja zachowawcza: oczyszczenie, odsolenie, drobne uzupełnienia i zabezpieczenie powierzchni';
const W5 = 'Konserwacja bieżąca i monitoring stanu';
const BRAK = 'Uzupełnić brakującą ocenę (stan zachowania lub techniczny)';

window.REGULY_WYTYCZNYCH = [
  { z: [5, 5], tekst: W1, priorytet: 1 },
  { t: [5, 5], tekst: W1, priorytet: 1 },

  { z: null, tekst: BRAK, priorytet: null },
  { t: null, tekst: BRAK, priorytet: null },

  { t: [4, 4], tekst: W2, priorytet: 2 },
  { z: [4, 4], tekst: W3, priorytet: 3 },
  { z: [3, 3], tekst: W4, priorytet: 4 },
  { z: [1, 2], tekst: W5, priorytet: 5 },
];
})();
