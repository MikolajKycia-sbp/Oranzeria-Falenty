# Oranżeria w Falentach – strona z modelem 3D

Otwórz `index.html` w przeglądarce (Chrome / Edge / Firefox). Potrzebny jest internet – biblioteka three.js ładowana jest z CDN.

## Pliki

| Plik | Rola |
|---|---|
| `index.html` | strona: model 3D (lewa) + tabela (prawa) |
| `data/model-data.js` | geometria i elementy wyeksportowane z Rhino (**generowany**) |
| `data/stan-techniczny.js` | wspólny stan techniczny elementów (podmieniany przyciskiem „Zapisz plik”) |
| `js/reguly-wytycznych.js` | reguły wyznaczania wytycznych – do edycji |
| `tools/export_model.py` | eksport `oranzeria-waloryzacja.3dm` → `data/model-data.js` |

## Jak strona czyta model

- Elementy = obiekty z warstw `Stan zachowania::*`. Stan zachowania = warstwa obiektu
  (członek bloku na warstwie `Default` dziedziczy warstwę wstawienia bloku).
- **ID elementu** = nazwa bloku bez przedrostka `Stan - `. Obiekty bez bloku dostają ID z nazwy
  obiektu (część przed `|`), a bez nazwy – z elementu warstwy `Oranzeria::*`, w którym leżą;
  powtórzenia są numerowane `.1`, `.2`… wzdłuż elewacji. Blok, którego części leżą na różnych
  warstwach stanu, dzielony jest na wiersze `.1`, `.2`…
- **Stan techniczny** – wartości wspólne dla wszystkich są w `data/stan-techniczny.js`.
  Zmiany wybrane w tabeli zapisują się najpierw tylko w Twojej przeglądarce (pomarańczowy znacznik
  i pasek „Niezapisane zmiany”). Żeby zobaczyli je inni:
  1. kliknij **Zapisz plik** – pobierze się nowy `stan-techniczny.js`,
  2. podmień nim `data/stan-techniczny.js` w folderze projektu,
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
