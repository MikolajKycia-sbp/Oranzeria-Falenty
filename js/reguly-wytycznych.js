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
 * priorytet: 1 (najpilniejsze) .. 4
 */
window.REGULY_WYTYCZNYCH = [
  { t: [5, 5], tekst: 'Natychmiastowe zabezpieczenie doraźne, następnie naprawa konstrukcyjna lub rekonstrukcja', priorytet: 1 },

  { z: null, t: null, tekst: 'Uzupełnić ocenę stanu zachowania i stanu technicznego', priorytet: null },
  { z: null, tekst: 'Uzupełnić ocenę stanu zachowania (inspekcja elementu)', priorytet: null },
  { t: null, tekst: 'Określić stan techniczny', priorytet: null },

  { z: [5, 5], t: [4, 4], tekst: 'Rekonstrukcja na podstawie reliktów i analogii; wcześniej dokumentacja i zabezpieczenie reliktów', priorytet: 1 },
  { z: [5, 5], tekst: 'Rekonstrukcja na podstawie reliktów i analogii; dokumentacja reliktów', priorytet: 2 },

  { z: [4, 4], t: [4, 4], tekst: 'Konserwacja z wymianą zniszczonych partii i wzmocnieniem strukturalnym', priorytet: 1 },
  { z: [4, 4], tekst: 'Konserwacja z uzupełnieniem rozległych ubytków (bez ingerencji konstrukcyjnej)', priorytet: 2 },

  { z: [3, 3], t: [4, 4], tekst: 'Naprawa konstrukcyjna oraz konserwacja z uzupełnieniem ubytków', priorytet: 2 },
  { z: [3, 3], tekst: 'Konserwacja zachowawcza z uzupełnieniem ubytków', priorytet: 3 },

  { z: [1, 2], t: [4, 4], tekst: 'Diagnostyka przyczyn i naprawa konstrukcyjna z zachowaniem substancji', priorytet: 2 },
  { z: [1, 2], tekst: 'Konserwacja bieżąca i monitoring', priorytet: 4 },
];
