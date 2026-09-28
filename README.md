# Pollination Desk

Pollination Desk is a small installable web app that matches flower shapes to pollinator guilds and explains how that fit shapes fruit set. It is meant as a bridge toward Cambium’s coming fruit-tree modes, without rebuilding tree physiology on this desk.

## Try it locally

```bash
git clone https://github.com/frank-dixon/pollination-desk.git
cd pollination-desk
npm i
npm run build
```

Open `docs/index.html` in a browser, or serve the `docs/` folder with any static server.

For day-to-day editing:

```bash
npm run watch
```

That one command watches Tailwind (`src/input.css` → `docs/css/pollination-desk.css`) and minifies commented JS (`src/js/*.js` → `docs/js/`). Data JSON under `src/data/` is copied into `docs/data/` on `npm run build`.

## Simple and Advanced

**Simple** mode asks you to pick a flower shape, then highlights primary pollinator partners and a plain-language fruit-set consequence.

**Advanced** mode adds trait comparisons (corolla depth, landing, reward, timing, sensory cues) against guild traits and a heuristic match score. Scores are teaching aids, not field measurements.

## Stack

- Tailwind CSS 3 utility classes in HTML
- Plain JavaScript (no TypeScript, no framework)
- Static PWA under `docs/` (manifest + service worker)
- Hub masthead back to [frank-dixon.github.io](https://frank-dixon.github.io/)

Built CSS and JS are committed so GitHub Pages needs no Node at runtime. Live demo: **https://frank-dixon.github.io/pollination-desk/**. Portfolio micro-projects commit, push, and deploy Pages on update.

## Science note

Floral syndromes are useful maps with real exceptions. Citations on the desk point to Fenster et al., Faegri & van der Pijl, Willmer, and pollen-limitation / crop fruit-set work. Prefer those sources over the UI heuristics when you need precision.
