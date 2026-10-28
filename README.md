# Oranżeria w Falentach – strona z modelem 3D

Otwórz `index.html` w przeglądarce (Chrome / Edge / Firefox). Potrzebny jest internet – biblioteka three.js ładowana jest z CDN.

## Pliki

| Plik | Rola |
|---|---|
| `index.html` | strona: model 3D (lewa) + tabela (prawa); kolory modelu wg stanu zachowania, stanu technicznego lub materiału |
| `data/model-data.js` | geometria i elementy wyeksportowane z Rhino (**generowany**) |
| `data/id-rejestr.json` | stałe ID elementów – który obiekt Rhino ma które ID (**generowany**, commitować razem z modelem) |
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
  powtórzenia są numerowane `.1`, `.2`… Blok, którego części leżą na różnych warstwach stanu,
  dzielony jest na wiersze `.1`, `.2`…
- **ID są stałe** (`data/id-rejestr.json`): po zmianie modelu istniejące elementy zachowują ID,
  nowe (np. po podziale) dostają kolejny wolny numer, a numery usuniętych nie wracają. Przy podziale
  w Rhino nowe części mają nowe ID – ich oceny trzeba wpisać od nowa.
- **Skala ocen** (oba stany): 1 – bardzo dobry … 5 – krytyczny / ruina albo „Brak oceny”
  (`js/skala.js`). Warstwy w Rhino mają skalę 1–10 – strona przelicza je parami:
  1–2 → 1, 3–4 → 2, 5–6 → 3, 7–8 → 4, 9–10 → 5.
- **Stan techniczny** wybiera się w tabeli.
- **Zapisywanie ocen** (obu stanów) – wartości wspólne dla wszystkich są w `data/oceny.js`.
  Zmiany wybrane w tabeli są najpierw tylko w Twojej przeglądarce (pomarańczowy znacznik
  i pasek „Niezapisane zmiany”). Żeby trafiły do projektu:
  1. kliknij **Zapisz plik** – w Chrome/Edge za pierwszym razem wskaż folder projektu
     (`Falenty-strona`); przeglądarka go zapamięta i kolejne zapisy idą od razu do `data/oceny.js`
     (działa też na stronie online). „Folder…” pozwala wskazać inny folder.
     W innych przeglądarkach plik się pobiera – wtedy podmień nim `data/oceny.js`.
  2. w GitHub Desktop: **Commit** → **Push**.

  Przed edycją zrób **Pull**, żeby mieć najnowszy plik – inaczej nadpiszecie sobie nawzajem zmiany.
  „Odrzuć” wraca do ostatnio zapisanych wartości, „Import” wczytuje plik `.js` lub `.json`.
- **Wytyczne** liczone są z reguł w `js/reguly-wytycznych.js` (obowiązuje pierwsza spełniona).

## Po zmianie modelu w Rhino

```bash
pip install rhino3dm
python tools/export_model.py oranzeria-waloryzacja.3dm data/model-data.js
```

Eksport kończy się raportem: nowe i usunięte elementy oraz oceny przypisane do ID, których już nie ma.
Obiekty muszą mieć zapisane siatki renderujące (zapis z Rhino z widokiem cieniowanym – domyślnie tak jest).
