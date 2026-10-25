# Symulator procentu składanego (ETF)

Kalkulator inwestycji z regularnymi wpłatami: okresy wpłat, własne lub historyczne stopy zwrotu
(S&P 500, MSCI World, WIG) i wynik skorygowany o inflację.

Strona: https://sudyk1.github.io/Symulator_Procentu_Skladanego/

## Uruchomienie

Wymaga Node.js 24.

```bash
npm install
npm run dev        # serwer deweloperski na http://localhost:5173
npm test           # testy obliczeń (Vitest)
npm run build      # wersja produkcyjna w dist/
```

## Struktura

```
src/
  domain/        logika obliczeń, bez Reacta – tu są testy
    simulate.ts    symulacja miesiąc po miesiącu, wartości realne, podsumowanie
    plan.ts        rozwijanie okresów na lata (tryb własny i historyczny)
    historical.ts  dostępne zakresy lat dla indeksów
    types.ts
  data/          roczne stopy zwrotu indeksów i inflacja, ze źródłami
  components/    komponenty widoku (React)
  lib/           formatowanie kwot, kolory motywu
  App.tsx        stan aplikacji i składanie komponentów
```

Nowe obliczenia dodawaj w `src/domain/` razem z testem, a w komponentach tylko je wyświetlaj.

## Gałęzie i wdrożenie

- `feature/*` → PR do `develop` (gałąź domyślna)
- `develop` → PR do `main` (chroniona, produkcja)
- Push do `main` uruchamia workflow, który testuje, buduje i publikuje stronę na GitHub Pages.
