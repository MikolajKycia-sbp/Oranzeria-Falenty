/*
 * Skala ocen - wspólna dla stanu zachowania i stanu technicznego.
 * Kolory są używane w tabeli, legendzie i do kolorowania modelu.
 */
window.SKALA = [
  { ocena: 1, nazwa: 'bardzo dobry', kolor: '#1a783c' },
  { ocena: 2, nazwa: 'dobry', kolor: '#8cc35f' },
  { ocena: 3, nazwa: 'średni', kolor: '#fae15a' },
  { ocena: 4, nazwa: 'zły', kolor: '#f08732' },
  { ocena: 5, nazwa: 'krytyczny / ruina', kolor: '#b41e1e' },
];
window.BRAK_OCENY = { nazwa: 'Brak oceny', kolor: '#c8c8c8' };

/*
 * Przeliczenie warstw z modelu Rhino ("Stan zachowania::Ocena 01..10") na skalę 1-5.
 * Używane jako początkowy stan zachowania elementów (oraz do przeliczenia ocen
 * zapisanych dawniej w skali 1-10).
 */
window.MAPA_SKALI_10_NA_5 = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5 };
