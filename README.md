# AgriPro Durian IPM (v3) · 榴莲综合防治

A bilingual (中文 / English), offline PWA for durian growers in Malaysia.

**The big change in v3:** the app no longer depends on a catalogue of every pest in
the world. Control decisions are made by **pest group**, defined by the traits that
actually decide which chemistry works:

| Trait | Why it matters |
|---|---|
| What it is (taxon) | Mites aren't insects; water moulds aren't fungi; many chemistries only work on one order |
| How it feeds (mouthparts) | Chewers → stomach poisons · sap-suckers → systemic · thrips → translaminar |
| Where it hides | Borers inside fruit/wood can't be reached by sprays |
| Which stage does damage | Growth regulators only kill young stages |

A pest nobody has catalogued still lands in one of ~22 groups through three plain
questions (where, what you see, what creature), and gets sound advice.

## Screens

- **Home**: set crop stage + weather, then a "watch now" list, flowering bee warning, search known examples.
- **Diagnose**: 3-step wizard that returns the likely pest group, the evidence behind it, and a low-confidence warning.
- **Group page**: what it is, why it matters for control, how to confirm it, action threshold, non-chemical steps first.
  Then ranked MoA classes with real actives and stage/bee/harvest/resistance warnings, a 3-spray rotation plan,
  and a list of what **not** to use.
- **Rotate**: the Rotation Helper (see below). Pick a pest and the IRAC group used last; it returns Avoid,
  Caution (shared target), and Rotate to, ranked by switching to a different target site and then by WHO toxicity.
- **Chemicals**: search by active ingredient (EN/中文). Each entry shows MoA, how it reaches the pest, WHO class,
  bee hazard, effect on natural enemies, weather timing, EU status, cross-resistance, resistance risk by pest,
  and links to the live China MRL table (GB 2763-2026). Searching for a **banned** active gives an honest
  "banned" answer with legal alternatives, never "no matches".
- **Learn**: short WhatsApp-shareable lessons (mouthparts, life stages, rotation, banned chemicals, fake labels,
  pollinators, systemic vs contact, safe mixing + tank-mix order).
- **Classic**: the v2 app (full catalogue, DT50 tables, risk simulator), still reachable from Learn.

## What was merged from the other apps

- **[Pest MoA rotation guide](https://github.com/stanleywoosweeleong/moarotationguide)**: the entire audited
  insecticide database (69 actives from the Bunting A chart), cross-resistance clusters, WHO / bee /
  natural-enemy / Beauveria / weather / EU tags, Malaysian removed-actives notices, tank-mix order, and the
  rotation algorithm. Copied verbatim into `src/core/moaDb.js`, including its audit log and "rejected by
  design" notes. Its policies apply to the whole app:
  - Banned actives are not browsable. They appear only as a search answer.
  - No MRL values or PHI numbers are stored. The app links out to live sources instead.
  - No half-life figures.
- **[Taijiang insect guide](https://stanleywoosweeleong.github.io/taijiang-insects/)**: the original line-art
  insect-order glyphs and the mouthparts figure (`src/components/Art.jsx`), the step-by-step identification
  idea, and its accessibility conventions (17px+ text, large buttons, Aa text-size toggle, first-launch
  language choice). Its photographs are **not** used, because they belong to the park and photographers.

## Project structure

```
src/
├── App.jsx                 # shell: header, bottom nav, hash router, language gate
├── core/                   # pure JS — the "brain", fully unit-tested
│   ├── groups.js           # ~22 trait-defined pest groups + advice
│   ├── diagnosis.js        # signs/culprits → scored groups
│   ├── moa.js              # plain-language MoA classes (IRAC/FRAC)
│   ├── moaDb.js            # ← rotation-guide database (verbatim)
│   ├── chemDb.js           # unified chemicals + banned search notices
│   ├── recommend.js        # group + stage → ranked options & rotation
│   ├── rotation.js         # Rotation Helper algorithm
│   ├── stages.js, lessons.js, examples.js
├── screens/                # Home, Diagnose, GroupPage, Chemicals, Rotate, Learn, Classic
├── components/Art.jsx      # illustrations
├── i18n/                   # useLang + UI strings
├── legacy/                 # v2 EnApp/ZhApp (Classic mode)
└── data/                   # v2 data — now supplies examples & photos
tests/core.test.js          # data-integrity + behaviour tests
```

## Develop

```bash
npm install
npm run dev     # http://localhost:5173/agripro-dipm-app/
npm test        # run after ANY data edit
npm run build
```

### Adding things

- **New pest species:** usually nothing. It is covered by its group. To list it as an example, add its id
  in `src/core/examples.js`.
- **New insecticide:** add it to the rotation database in `src/core/moaDb.js` (follow its audit notes).
- **New fungicide / biological:** add it to `LOCAL` in `src/core/chemDb.js`.
- **New ban:** add it to `REMOVED_MY` (`moaDb.js`) and delete its rows. The tests fail if a removed active
  is still browsable.

Deploys to GitHub Pages on every push to `main` (`.github/workflows/deploy.yml`).

*Guidance only. The legal reference is the Malaysian Pesticides Board (LRMP) register and the product label.*
