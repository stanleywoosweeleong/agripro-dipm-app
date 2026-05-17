# AgriPro DIPM — Unified Bilingual App (中文 / English)

A unified, bilingual, installable PWA for durian orchard pest and disease management.
One codebase, two languages, **add data once and it appears in both**.

> Replaces the separate [`agripro-dipm-en`](https://github.com/stanleywoosweeleong/agripro-dipm-en) (English) and [`agripro-dipm`](https://github.com/stanleywoosweeleong/agripro-dipm) (Chinese) repos.

## Key features

- **Bilingual** — language toggle in the top-right (🌐 中 / EN). Defaults to Chinese; choice persists per device.
- **Single source of truth for data** — all pests, MOA mappings, application advice, and DT50 chemicals live in `src/data/`. Each translatable field is `{ en: ..., zh: ... }`. Add a new pest once with both translations and it shows up in both languages.
- **Chemicals always bilingual** — DT50 chemical names display in both languages regardless of UI language (for China-export reference contexts).
- **Code-split per language** — users only download the active language's UI bundle (~28 KB gzipped each), not both.
- **Fully offline** — installable PWA with service worker precaching all data, JS, CSS, icons.
- **Auto-deploy** to GitHub Pages on every push to `main`.

## Setup (first time)

You need [Node.js](https://nodejs.org/) v18+ installed.

```bash
npm install      # ~30 sec
npm run dev      # preview at http://localhost:5173/agripro-dipm-app/
```

## Project structure

```
agripro-dipm-app/
├── .github/workflows/deploy.yml   # CI: auto-build & deploy
├── public/                        # PWA icons, favicon
├── src/
│   ├── App.jsx                    # Top-level shell + language toggle + Suspense
│   ├── EnApp.jsx                  # English UI (consumes unified data)
│   ├── ZhApp.jsx                  # Chinese UI (consumes unified data)
│   ├── main.jsx                   # React entry + service worker
│   ├── index.css                  # Tailwind + safe-area
│   ├── i18n/
│   │   ├── useLang.jsx            # LanguageProvider + useLang() hook
│   │   └── ui.js                  # Reserved for shared cross-cutting UI strings
│   └── data/                      # Single source of truth for all data
│       ├── index.js               # Re-exports
│       ├── pests.js               # 85 pests (bilingual translatable fields)
│       ├── moa.js                 # 78 MOA mappings (bilingual)
│       ├── application.js         # 78 application notes (bilingual)
│       └── chemicals.js           # 49 DT50 chemicals (name always bilingual)
├── index.html
├── package.json
└── vite.config.js                 # base: /agripro-dipm-app/
```

## Adding a new pest

Edit `src/data/pests.js` and append:

```js
{
  id: 'new-pest-id',
  category: 'Insects',
  common: { en: 'New Pest Name', zh: '新害虫名称' },
  scientific: 'Genus species',
  target: { en: 'Where it feeds', zh: '取食位置' },
  symptoms: { en: '...', zh: '...' },
  control: { en: '...', zh: '...' },
  // ... other fields
}
```

That's it — the pest appears in both EN and ZH UIs automatically.

## Adding a new chemical

Edit `src/data/chemicals.js`. Names use the bilingual joined format (`'Chemical Name (中文名)'`); other text fields use `{ en, zh }`.

## Deploy to GitHub Pages

The new repo should be named **`agripro-dipm-app`** (matches `vite.config.js` base path).

```bash
git init
git add .
git commit -m "Initial unified bilingual app"
git branch -M main
git remote add origin https://github.com/<your-username>/agripro-dipm-app.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: GitHub Actions**.

Live at: `https://<your-username>.github.io/agripro-dipm-app/`

## Archive the old repos (optional but recommended)

Once the unified app is live and tested:

- For `agripro-dipm-en`: Settings → scroll to bottom → "Archive this repository"
- For `agripro-dipm`: same

Archived repos remain visible but read-only, signaling they're no longer maintained.

---

## 中文摘要

这是一个双语统一版的 AgriPro DIPM 应用，整合了原先独立的英文版与中文版。

- 通过右上角 🌐 按钮切换中英文，默认中文。
- 所有病虫害、MOA 映射、施药指引、DT50 化学数据集中在 `src/data/` 文件夹下，每条可翻译字段以 `{ en, zh }` 对象保存。
- 新增一个病虫害时，只需在 `src/data/pests.js` 中加入一次（包含双语），两语界面自动同步。
- 化学品名称按用户要求始终双语显示（中国出口参考场景）。
- 按语言代码分包，用户只下载当前语言所需的 UI 资源（约 28 KB gzipped）。

部署到 GitHub Pages 的流程与原版相同，仓库名为 `agripro-dipm-app`。
