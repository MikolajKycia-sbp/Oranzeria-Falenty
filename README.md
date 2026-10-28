# Oranżeria w Falentach – strona z modelem 3D

Otwórz `index.html` w przeglądarce (Chrome / Edge / Firefox). Potrzebny jest internet – biblioteka three.js ładowana jest z CDN.

## Pliki

| Plik | Rola |
|---|---|
| `index.html` | strona: model 3D (lewa) + tabela (prawa); kolory modelu wg stanu zachowania, stanu technicznego lub materiału |
| `data/model-data.js` | geometria i elementy wyeksportowane z Rhino (**generowany**) |
| `data/oceny.js` | wspólne oceny: zmiany stanu zachowania i stan techniczny (podmieniany przyciskiem „Zapisz plik”) |
| `js/skala.js` | skala ocen 1–5 (nazwy, kolory) i przeliczenie warstw Rhino 1–10 → 1–5 – do edycji |
| `js/reguly-wytycznych.js` | reguły wyznaczania wytycznych – do edycji |
| `tools/export_model.py` | eksport `oranzeria-waloryzacja.3dm` → `data/model-data.js` |

## Jak strona czyta model

- Elementy = obiekty z warstw `Stan zachowania::*`. Stan zachowania = warstwa obiektu
  (członek bloku na warstwie `Default` dziedziczy warstwę wstawienia bloku) – to tylko wartość
  początkowa. Stan zmieniony w tabeli jest ostateczny: element zmienia kolor w modelu, a plik
  `.3dm` pozostaje bez zmian.
- **ID elementu** = nazwa bloku bez przedrostka `Stan - `. Obiekty bez bloku dostają ID z nazwy
  obiektu (część przed `|`), a bez nazwy – z elementu warstwy `Oranzeria::*`, w którym leżą;
  powtórzenia są numerowane `.1`, `.2`… wzdłuż elewacji. Blok, którego części leżą na różnych
  warstwach stanu, dzielony jest na wiersze `.1`, `.2`…
- **Skala ocen** (oba stany): 1 – bardzo dobry … 5 – krytyczny / ruina albo „Brak oceny”
  (`js/skala.js`). Warstwy w Rhino mają skalę 1–10 – strona przelicza je parami:
  1–2 → 1, 3–4 → 2, 5–6 → 3, 7–8 → 4, 9–10 → 5.
- **Stan techniczny** wybiera się w tabeli.
- **Zapisywanie ocen** (obu stanów) – wartości wspólne dla wszystkich są w `data/oceny.js`.
  Zmiany wybrane w tabeli zapisują się najpierw tylko w Twojej przeglądarce (pomarańczowy znacznik
  i pasek „Niezapisane zmiany”). Żeby zobaczyli je inni:
  1. kliknij **Zapisz plik** – pobierze się nowy `oceny.js`,
  2. podmień nim `data/oceny.js` w folderze projektu,
  3. w GitHub Desktop: **Commit** → **Push**.

  Przed edycją zrób **Pull**, żeby mieć najnowszy plik – inaczej nadpiszecie sobie nawzajem zmiany.
  „Odrzuć” cofa niezapisane zmiany, „Import” wczytuje plik `.js` lub `.json`.
- **Wytyczne** liczone są z reguł w `js/reguly-wytycznych.js` (obowiązuje pierwsza spełniona).

## Po zmianie modelu w Rhino

```bash
pip install rhino3dm
python tools/export_model.py oranzeria-waloryzacja.3dm data/model-data.js
```

Obiekty muszą mieć zapisane siatki renderujące (zapis z Rhino z widokiem cieniowanym – domyślnie tak jest).
