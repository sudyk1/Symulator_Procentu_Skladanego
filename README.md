# Compound Interest Simulator (ETF)

Investment calculator with regular contributions: contribution periods, own or historical rates of return
(S&P 500, MSCI World and WIG indices, SPY and IWDA ETFs), side-by-side comparison of two assets
and inflation-adjusted results. The interface is available in English and Polish.

Live site: https://sudyk1.github.io/Symulator_Procentu_Skladanego/

## Getting started

Requires Node.js 24.

```bash
npm install
npm run dev        # dev server on http://localhost:5173
npm test           # unit tests (Vitest)
npm run build      # production build in dist/
```

## Project structure

```
src/
  domain/        calculation logic, no React – this is where the tests live
    simulate.ts    month-by-month simulation, real (inflation-adjusted) values, summary
    plan.ts        expanding periods into years (own and historical mode)
    historical.ts  available year ranges for each asset
    types.ts
  data/          annual returns of indices and ETFs, inflation, with sources
  i18n/          translations (messages.ts) and the language provider
  components/    UI components (React)
  lib/           number formatting, theme colours
  App.tsx        application state and composition
```

Guidelines:

- Put new calculations in `src/domain/` together with a test; components only display results.
- All code, comments, commit messages and tests are in English.
- User-facing text goes into `src/i18n/messages.ts` – add every key in both `en` and `pl`
  (TypeScript reports a missing translation).

## Branches and deployment

- `feature/*` → pull request into `develop` (default branch)
- `develop` → pull request into `main` (protected, production)
- CI (`Test and build`) runs on every pull request and must pass before merging into `main`.
- A push to `main` runs the Pages workflow, which tests, builds and publishes the site.
