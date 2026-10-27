/*
 * Reguly wyznaczania wytycznych na podstawie:
 *   z - stan zachowania (ocena 1..10 z warstwy modelu; null = "Brak oceny")
 *   t - stan techniczny ('dobry' | 'dostateczny' | 'zly' | 'awaryjny'; null = nieokreslony)
 *
 * Reguly sprawdzane sa po kolei - obowiazuje PIERWSZA spelniona.
 * Warunek:
 *   z: [min, max]   - zakres oceny (wlacznie), null - "brak oceny", pominiety - dowolna
 *   t: [...]        - lista stanow technicznych, [null] - nieokreslony, pominiety - dowolny
 * priorytet: 1 (najpilniejsze) .. 4
 */
window.STANY_TECHNICZNE = [
  { key: 'dobry', label: 'dobry' },
  { key: 'dostateczny', label: 'dostateczny' },
  { key: 'zly', label: 'zły' },
  { key: 'awaryjny', label: 'awaryjny' },
];

window.REGULY_WYTYCZNYCH = [
  { t: ['awaryjny'], tekst: 'Natychmiastowe zabezpieczenie doraźne, następnie naprawa konstrukcyjna lub rekonstrukcja', priorytet: 1 },

  { z: null, t: [null], tekst: 'Uzupełnić ocenę stanu zachowania i stanu technicznego', priorytet: null },
  { z: null, tekst: 'Uzupełnić ocenę stanu zachowania (inspekcja elementu)', priorytet: null },
  { t: [null], tekst: 'Określić stan techniczny', priorytet: null },

  { z: [10, 10], t: ['zly'], tekst: 'Rekonstrukcja na podstawie reliktów i analogii; wcześniej dokumentacja i zabezpieczenie reliktów', priorytet: 1 },
  { z: [10, 10], tekst: 'Rekonstrukcja na podstawie reliktów i analogii; dokumentacja reliktów', priorytet: 2 },

  { z: [8, 9], t: ['zly'], tekst: 'Konserwacja z wymianą zniszczonych partii i wzmocnieniem strukturalnym', priorytet: 1 },
  { z: [8, 9], tekst: 'Konserwacja z uzupełnieniem rozległych ubytków (bez ingerencji konstrukcyjnej)', priorytet: 2 },

  { z: [6, 7], t: ['zly'], tekst: 'Naprawa konstrukcyjna oraz konserwacja z uzupełnieniem ubytków', priorytet: 2 },
  { z: [6, 7], tekst: 'Konserwacja zachowawcza z uzupełnieniem ubytków', priorytet: 3 },

  { z: [4, 5], t: ['zly'], tekst: 'Naprawa konstrukcyjna; konserwacja powierzchni', priorytet: 2 },
  { z: [4, 5], tekst: 'Konserwacja zachowawcza (oczyszczenie, drobne uzupełnienia)', priorytet: 3 },

  { z: [1, 3], t: ['zly'], tekst: 'Diagnostyka przyczyn i naprawa konstrukcyjna z zachowaniem substancji', priorytet: 2 },
  { z: [1, 3], tekst: 'Konserwacja bieżąca i monitoring', priorytet: 4 },
];
