/*
 * Reguly wyznaczania wytycznych na podstawie dwoch ocen w tej samej skali 1..10
 * (1 - bardzo dobry ... 10 - ruina / utrata):
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
  { t: [9, 10], tekst: 'Natychmiastowe zabezpieczenie doraźne, następnie naprawa konstrukcyjna lub rekonstrukcja', priorytet: 1 },

  { z: null, t: null, tekst: 'Uzupełnić ocenę stanu zachowania i stanu technicznego', priorytet: null },
  { z: null, tekst: 'Uzupełnić ocenę stanu zachowania (inspekcja elementu)', priorytet: null },
  { t: null, tekst: 'Określić stan techniczny', priorytet: null },

  { z: [10, 10], t: [6, 8], tekst: 'Rekonstrukcja na podstawie reliktów i analogii; wcześniej dokumentacja i zabezpieczenie reliktów', priorytet: 1 },
  { z: [10, 10], tekst: 'Rekonstrukcja na podstawie reliktów i analogii; dokumentacja reliktów', priorytet: 2 },

  { z: [8, 9], t: [6, 8], tekst: 'Konserwacja z wymianą zniszczonych partii i wzmocnieniem strukturalnym', priorytet: 1 },
  { z: [8, 9], tekst: 'Konserwacja z uzupełnieniem rozległych ubytków (bez ingerencji konstrukcyjnej)', priorytet: 2 },

  { z: [6, 7], t: [6, 8], tekst: 'Naprawa konstrukcyjna oraz konserwacja z uzupełnieniem ubytków', priorytet: 2 },
  { z: [6, 7], tekst: 'Konserwacja zachowawcza z uzupełnieniem ubytków', priorytet: 3 },

  { z: [4, 5], t: [6, 8], tekst: 'Naprawa konstrukcyjna; konserwacja powierzchni', priorytet: 2 },
  { z: [4, 5], tekst: 'Konserwacja zachowawcza (oczyszczenie, drobne uzupełnienia)', priorytet: 3 },

  { z: [1, 3], t: [6, 8], tekst: 'Diagnostyka przyczyn i naprawa konstrukcyjna z zachowaniem substancji', priorytet: 2 },
  { z: [1, 3], tekst: 'Konserwacja bieżąca i monitoring', priorytet: 4 },
];
