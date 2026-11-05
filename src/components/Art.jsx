// Illustrations. Original line art merged from two of Stanley's apps:
//   • PestIcon — coloured pest icons from the Pest MoA rotation guide
//   • ORDER_GLYPHS, mouthparts & life-cycle figures — adapted from the Taijiang insect guide
// No third-party photographs are used anywhere in the app's own art.
import React from 'react';

export const ORDER_GLYPHS = {
 "Odonata": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"32\" cy=\"12\" r=\"5\"/><path d=\"M32 17v38\"/><path d=\"M30 22C14 16 6 22 7 30c6 6 16 2 23-2Z\"/><path d=\"M34 22c16-6 24 0 23 8-6 6-16 2-23-2Z\"/><path d=\"M30 28C18 34 10 42 12 48c6 2 14-6 18-12Z\"/><path d=\"M34 28c12 6 20 14 18 20-6 2-14-6-18-12Z\"/></g>",
 "Orthoptera": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 36c4-8 14-12 30-12 8 0 14 3 16 8l-4 2H14z\"/><path d=\"M14 34c6-4 20-5 38-2\"/><path d=\"M46 24l10-16M44 25l6-19\"/><path d=\"M50 30c-2 6-8 10-20 10\"/><path d=\"M24 40l-8 14M24 40l-4 16\"/><path d=\"M36 40l6 12M44 36l12 10\"/><circle cx=\"53\" cy=\"27\" r=\"1.6\" fill=\"currentColor\"/></g>",
 "Mantodea": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M44 10l-6 6-4-2-2 6\"/><circle cx=\"46\" cy=\"9\" r=\"3\"/><path d=\"M34 18c-6 2-10 10-12 22l-4 14\"/><path d=\"M34 18c4 10 2 24-6 36\"/><path d=\"M32 20c-10 0-16 2-20 8\"/><path d=\"M36 22c-4-8-12-8-18-4 6 0 10 4 12 10\"/><path d=\"M40 20c8 0 12 6 14 14l-6-2\"/><path d=\"M26 36l-14 4M28 46l-8 10M30 46l8 10\"/></g>",
 "Blattodea": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"32\" cy=\"36\" rx=\"14\" ry=\"20\"/><path d=\"M32 22v34M22 26c6 4 14 4 20 0\"/><path d=\"M28 16l-14-10M36 16l14-10\"/><path d=\"M20 30l-10-4M20 40l-12 2M22 48l-10 8M44 30l10-4M44 40l12 2M42 48l10 8\"/></g>",
 "Isoptera": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"32\" cy=\"14\" r=\"6\"/><ellipse cx=\"32\" cy=\"27\" rx=\"6\" ry=\"6\"/><ellipse cx=\"32\" cy=\"45\" rx=\"9\" ry=\"13\"/><path d=\"M28 9l-6-5M36 9l6-5\"/><path d=\"M26 24l-10-2M26 30l-10 6M38 24l10-2M38 30l10 6\"/></g>",
 "Hemiptera": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M32 10c-10 0-18 8-18 20 0 12 8 24 18 26 10-2 18-14 18-26 0-12-8-20-18-20Z\"/><path d=\"M20 24h24M32 26v30\"/><path d=\"M26 16l-8-8M38 16l8-8\"/><path d=\"M16 32l-10 0M18 42l-10 6M46 32l10 0M44 42l10 6\"/></g>",
 "Coleoptera": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"32\" cy=\"13\" r=\"5\"/><path d=\"M22 24h20\"/><path d=\"M32 24v32\"/><path d=\"M32 24c-10 0-16 10-14 22 2 7 8 10 14 10 6 0 12-3 14-10 2-12-4-22-14-22Z\"/><path d=\"M28 9l-6-6M36 9l6-6\"/><path d=\"M19 32l-10-2M18 42l-10 6M45 32l10-2M46 42l10 6\"/></g>",
 "Diptera": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"32\" cy=\"14\" r=\"7\"/><ellipse cx=\"32\" cy=\"36\" rx=\"9\" ry=\"14\"/><path d=\"M26 28C12 22 6 30 10 38c6 2 12-4 16-8Z\"/><path d=\"M38 28c14-6 20 2 16 10-6 2-12-4-16-8Z\"/><path d=\"M24 42l-10 8M24 36l-12 0M40 42l10 8M40 36l12 0\"/></g>",
 "Lepidoptera": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M32 20v30\"/><circle cx=\"32\" cy=\"16\" r=\"4\"/><path d=\"M29 13l-6-8M35 13l6-8\"/><path d=\"M30 24C18 10 6 14 8 26c2 8 12 10 22 8Z\"/><path d=\"M34 24c12-14 24-10 22 2-2 8-12 10-22 8Z\"/><path d=\"M30 36C20 36 10 42 12 50c4 6 14 0 18-8Z\"/><path d=\"M34 36c10 0 20 6 18 14-4 6-14 0-18-8Z\"/></g>",
 "Hymenoptera": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"18\" cy=\"24\" r=\"6\"/><ellipse cx=\"31\" cy=\"30\" rx=\"7\" ry=\"6\"/><path d=\"M38 32c10-2 16 6 14 14-4 6-12 4-14-4-1-4 0-8 0-10Z\"/><path d=\"M40 36h10M40 42h10\"/><path d=\"M28 26C32 12 44 12 46 20\"/><path d=\"M32 28c6-8 16-6 18 0\"/><path d=\"M14 20l-6-8M20 19l2-10\"/><path d=\"M26 36l-6 10M32 36l0 12M36 36l8 8\"/></g>",
 "Neuroptera": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"32\" cy=\"12\" r=\"4\"/><path d=\"M32 16v40\"/><path d=\"M29 9l-8-5 2 4M35 9l8-5-2 4\"/><path d=\"M30 20C16 24 8 36 12 50c8-2 14-14 18-24Z\"/><path d=\"M34 20c14 4 22 16 18 30-8-2-14-14-18-24Z\"/><path d=\"M22 30h6M22 38h7M42 30h-6M42 38h-7\"/></g>",
 "Dermaptera": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"32\" cy=\"10\" r=\"5\"/><rect x=\"26\" y=\"16\" width=\"12\" height=\"10\" rx=\"3\"/><path d=\"M27 26c-2 8-2 16 1 22h8c3-6 3-14 1-22\"/><path d=\"M29 48c-6 4-8 10-4 12 2-4 5-6 7-8M35 48c6 4 8 10 4 12-2-4-5-6-7-8\"/><path d=\"M28 6l-6-4M36 6l6-4\"/><path d=\"M26 20l-10-2M26 32l-10 4M38 20l10-2M38 32l10 4\"/></g>"
};

export const PestIcon = ({ pest, className = "w-9 h-9" }) => {
  const icons = {
    // Bright lime green, wedge body, large hind jumping leg
    leafhopper: (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <path d="M16 5 L23 11 L21 24 L11 24 L9 11 Z" fill="#84cc16" stroke="#365314" strokeWidth="0.8"/>
        <ellipse cx="16" cy="8" rx="3" ry="2.5" fill="#65a30d" stroke="#365314" strokeWidth="0.5"/>
        <circle cx="14.5" cy="8" r="0.7" fill="#0a0a0a"/>
        <circle cx="17.5" cy="8" r="0.7" fill="#0a0a0a"/>
        <line x1="14.5" y1="6" x2="12" y2="2.5" stroke="#365314" strokeWidth="0.7"/>
        <line x1="17.5" y1="6" x2="20" y2="2.5" stroke="#365314" strokeWidth="0.7"/>
        <path d="M20 16 L27 13 L26 19 L22 24" fill="none" stroke="#365314" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
        <line x1="11" y1="18" x2="6" y2="22" stroke="#365314" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    // Pale tent-winged jumping insect with prominent transparent wings
    psyllid: (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <ellipse cx="11" cy="16" rx="5" ry="9" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.7" transform="rotate(-20 11 16)"/>
        <ellipse cx="21" cy="16" rx="5" ry="9" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.7" transform="rotate(20 21 16)"/>
        <ellipse cx="16" cy="16" rx="2.5" ry="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.6"/>
        <circle cx="16" cy="7" r="2.2" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5"/>
        <line x1="14.8" y1="5" x2="12.5" y2="2.5" stroke="#475569" strokeWidth="0.6"/>
        <line x1="17.2" y1="5" x2="19.5" y2="2.5" stroke="#475569" strokeWidth="0.6"/>
        <circle cx="15" cy="7" r="0.5" fill="#0a0a0a"/>
        <circle cx="17" cy="7" r="0.5" fill="#0a0a0a"/>
      </svg>
    ),
    // White waxy oval with segmentation and lateral filaments
    mealybug: (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <ellipse cx="16" cy="16" rx="8.5" ry="6.5" fill="#fafafa" stroke="#94a3b8" strokeWidth="0.8"/>
        <path d="M11 11 Q16 13 21 11" fill="none" stroke="#cbd5e1" strokeWidth="0.6"/>
        <path d="M10 16 H22" fill="none" stroke="#cbd5e1" strokeWidth="0.6"/>
        <path d="M11 21 Q16 19 21 21" fill="none" stroke="#cbd5e1" strokeWidth="0.6"/>
        <line x1="8" y1="12" x2="4" y2="10" stroke="#cbd5e1" strokeWidth="0.7"/>
        <line x1="7.5" y1="16" x2="3" y2="16" stroke="#cbd5e1" strokeWidth="0.7"/>
        <line x1="8" y1="20" x2="4" y2="22" stroke="#cbd5e1" strokeWidth="0.7"/>
        <line x1="24" y1="12" x2="28" y2="10" stroke="#cbd5e1" strokeWidth="0.7"/>
        <line x1="24.5" y1="16" x2="29" y2="16" stroke="#cbd5e1" strokeWidth="0.7"/>
        <line x1="24" y1="20" x2="28" y2="22" stroke="#cbd5e1" strokeWidth="0.7"/>
      </svg>
    ),
    // Tiny yellow-amber elongated sliver with fringed wings
    thrips: (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="14" y="6" width="4" height="20" rx="1.8" fill="#eab308" stroke="#854d0e" strokeWidth="0.6"/>
        <circle cx="16" cy="7" r="2.2" fill="#a16207" stroke="#854d0e" strokeWidth="0.5"/>
        <line x1="14" y1="13" x2="18" y2="13" stroke="#854d0e" strokeWidth="0.4"/>
        <line x1="14" y1="17" x2="18" y2="17" stroke="#854d0e" strokeWidth="0.4"/>
        <line x1="14" y1="21" x2="18" y2="21" stroke="#854d0e" strokeWidth="0.4"/>
        <line x1="14" y1="10" x2="9" y2="11" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
        <line x1="14" y1="14" x2="9" y2="16" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
        <line x1="14" y1="19" x2="9" y2="22" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
        <line x1="18" y1="10" x2="23" y2="11" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
        <line x1="18" y1="14" x2="23" y2="16" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
        <line x1="18" y1="19" x2="23" y2="22" stroke="#854d0e" strokeWidth="0.8" strokeLinecap="round"/>
        <line x1="15" y1="5" x2="13" y2="2.5" stroke="#854d0e" strokeWidth="0.6"/>
        <line x1="17" y1="5" x2="19" y2="2.5" stroke="#854d0e" strokeWidth="0.6"/>
      </svg>
    ),
    // Red round body with 8 spider legs (arachnid, not insect)
    spider_mite: (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <ellipse cx="16" cy="16" rx="6" ry="5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.7"/>
        <circle cx="13.5" cy="14.5" r="1" fill="#450a0a"/>
        <circle cx="18.5" cy="14.5" r="1" fill="#450a0a"/>
        <line x1="10.5" y1="14" x2="4" y2="10" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="10" y1="16" x2="3" y2="16" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="11" y1="19" x2="5" y2="23" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="13" y1="20.5" x2="10" y2="27" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="21.5" y1="14" x2="28" y2="10" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="22" y1="16" x2="29" y2="16" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="21" y1="19" x2="27" y2="23" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="19" y1="20.5" x2="22" y2="27" stroke="#7f1d1d" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    // Green segmented worm body
    caterpillar: (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <circle cx="6" cy="19" r="4" fill="#22c55e" stroke="#14532d" strokeWidth="0.7"/>
        <circle cx="11.5" cy="18" r="4.3" fill="#16a34a" stroke="#14532d" strokeWidth="0.7"/>
        <circle cx="17" cy="17" r="4.3" fill="#22c55e" stroke="#14532d" strokeWidth="0.7"/>
        <circle cx="22.5" cy="16" r="4.3" fill="#16a34a" stroke="#14532d" strokeWidth="0.7"/>
        <circle cx="27.5" cy="15" r="3.5" fill="#22c55e" stroke="#14532d" strokeWidth="0.7"/>
        <circle cx="28.5" cy="13.5" r="0.8" fill="#0a0a0a"/>
        <line x1="6" y1="23" x2="6" y2="26" stroke="#14532d" strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="11.5" y1="22" x2="11.5" y2="25" stroke="#14532d" strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="17" y1="21" x2="17" y2="24" stroke="#14532d" strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="22.5" y1="20" x2="22.5" y2="23" stroke="#14532d" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
    // Green grasshopper with distinctive bent jumping leg
    grasshopper: (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <ellipse cx="14" cy="16" rx="9" ry="3.8" fill="#65a30d" stroke="#365314" strokeWidth="0.7" transform="rotate(-12 14 16)"/>
        <ellipse cx="6" cy="14.5" rx="3.2" ry="2.8" fill="#4d7c0f" stroke="#365314" strokeWidth="0.6"/>
        <circle cx="4.5" cy="13.5" r="0.8" fill="#0a0a0a"/>
        <line x1="5" y1="12.5" x2="2" y2="9" stroke="#365314" strokeWidth="0.7" strokeLinecap="round"/>
        <line x1="6" y1="11.5" x2="4" y2="7" stroke="#365314" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M18 15 L24 9 L26 14 L21 22" fill="#4d7c0f" stroke="#365314" strokeWidth="0.7" strokeLinejoin="round"/>
        <line x1="21" y1="22" x2="27" y2="28" stroke="#365314" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="11" y1="18" x2="9" y2="25" stroke="#365314" strokeWidth="1.1" strokeLinecap="round"/>
        <line x1="15" y1="18.5" x2="14" y2="25" stroke="#365314" strokeWidth="1.1" strokeLinecap="round"/>
        <path d="M13 14 Q17 13 21 15" fill="none" stroke="#365314" strokeWidth="0.5"/>
      </svg>
    ),
    // "All" — 2x2 grid of pest-color dots indicating "all categories"
    all: (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <circle cx="10" cy="10" r="4" fill="#84cc16"/>
        <circle cx="22" cy="10" r="4" fill="#eab308"/>
        <circle cx="10" cy="22" r="4" fill="#dc2626"/>
        <circle cx="22" cy="22" r="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.7"/>
      </svg>
    ),
  };
  return icons[pest] || icons.all;
};

// Extra line glyphs in the same style as the Taijiang order glyphs (64×64,
// stroke = currentColor) for groups that are not insect orders.
const G = (d) => `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
export const EXTRA_GLYPHS = {
  fruitBorer: G('<ellipse cx="32" cy="36" rx="20" ry="22"/><path d="M32 14V6M28 8h8"/><path d="M18 24l-4-3M46 24l4-3M14 36h-4M50 36h4M18 48l-4 3M46 48l4 3"/><circle cx="38" cy="32" r="4" fill="currentColor"/><path d="M38 36c-2 6 2 10-2 16"/>'),
  trunk: G('<path d="M22 60V4M42 60V4"/><path d="M22 18c6 2 8 8 6 14s2 12 8 14"/><circle cx="36" cy="46" r="3" fill="currentColor"/><path d="M40 50c4 2 8 2 10 0M42 54c3 1 6 1 8-1"/>'),
  holes: G('<path d="M14 60V4M50 60V4"/>') + '<g fill="currentColor"><circle cx="24" cy="14" r="2"/><circle cx="36" cy="20" r="2"/><circle cx="28" cy="30" r="2"/><circle cx="40" cy="36" r="2"/><circle cx="22" cy="44" r="2"/><circle cx="34" cy="52" r="2"/><circle cx="44" cy="12" r="2"/></g>',
  snail: G('<path d="M6 48h40c6 0 10-4 10-8"/><circle cx="30" cy="32" r="14"/><path d="M30 32c0-4 4-6 6-4s1 8-4 9-10-3-9-9 7-11 13-9"/><path d="M50 40l4-12M54 40l6-10"/>'),
  worm: G('<path d="M8 40c6-12 12-12 16 0s10 12 16 0 10-12 16 0"/><circle cx="56" cy="40" r="1.5" fill="currentColor"/><path d="M10 54h44"/>'),
  drop: G('<path d="M32 6C22 22 14 32 14 42a18 18 0 0 0 36 0c0-10-8-20-18-36Z"/><path d="M24 44c0 4 3 8 8 8"/>'),
  branch: G('<path d="M8 56L40 24l16-16"/><path d="M40 24l-2-14M30 34l-14-6"/><path d="M44 12c4 0 6 2 8 4"/><path d="M18 40l6 6M24 34l6 6" stroke-dasharray="3 3"/>'),
  leafSpot: G('<path d="M10 54C10 26 26 10 56 8c0 30-16 46-46 46Z"/><path d="M10 54c10-16 22-28 36-36"/>') + '<g fill="currentColor"><circle cx="26" cy="28" r="3"/><circle cx="40" cy="34" r="2.5"/><circle cx="30" cy="42" r="2"/></g>',
  root: G('<path d="M32 4v22"/><path d="M32 26c-6 6-14 8-18 18M32 26c6 6 14 8 18 18M32 26v30M22 36l-8 2M42 36l8 2M32 44l-6 10M32 44l6 10"/><path d="M8 26h48"/>'),
  bacteria: G('<rect x="10" y="20" width="26" height="12" rx="6"/><rect x="28" y="36" width="26" height="12" rx="6"/><path d="M36 26c6 0 8-4 12-4M10 42c4 0 6-4 10-4"/>'),
  paw: G('<ellipse cx="32" cy="42" rx="12" ry="10"/><ellipse cx="16" cy="28" rx="5" ry="7"/><ellipse cx="26" cy="18" rx="5" ry="7"/><ellipse cx="38" cy="18" rx="5" ry="7"/><ellipse cx="48" cy="28" rx="5" ry="7"/>'),
  fern: G('<path d="M32 60V6"/><path d="M32 14c-8-2-12-6-14-10M32 14c8-2 12-6 14-10M32 26c-10-2-16-6-18-12M32 26c10-2 16-6 18-12M32 38c-10-2-18-6-20-12M32 38c10-2 18-6 20-12M32 50c-8-2-14-6-16-10M32 50c8-2 14-6 16-10"/>'),
};

const GROUP_ART = {
  'phloem-suckers': { pest: 'leafhopper' },
  'scale-mealybug': { pest: 'mealybug' },
  thrips: { pest: 'thrips' },
  'plant-bugs': { glyph: 'Hemiptera' },
  'leaf-caterpillars': { pest: 'caterpillar' },
  'leaf-beetles': { pest: 'grasshopper' },
  'fruit-borers': { extra: 'fruitBorer' },
  'fruit-flies': { glyph: 'Diptera' },
  'trunk-borers': { extra: 'trunk' },
  'shot-hole': { extra: 'holes' },
  'soil-pests': { glyph: 'Isoptera' },
  'ants-wasps': { glyph: 'Hymenoptera' },
  mites: { pest: 'spider_mite' },
  snails: { extra: 'snail' },
  nematodes: { extra: 'worm' },
  oomycete: { extra: 'drop' },
  'canker-dieback': { extra: 'branch' },
  'leaf-spots': { extra: 'leafSpot' },
  'root-fungi': { extra: 'root' },
  bacterial: { extra: 'bacteria' },
  vertebrates: { extra: 'paw' },
  epiphytes: { extra: 'fern' },
};

export function Glyph({ name, className = 'w-8 h-8' }) {
  const body = ORDER_GLYPHS[name] || EXTRA_GLYPHS[name];
  if (!body) return null;
  return <svg viewBox="0 0 64 64" className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: body }} />;
}

/** Icon for a pest group: coloured pest icon where we have one, line glyph otherwise. */
export function GroupArt({ id, className = 'w-9 h-9' }) {
  const a = GROUP_ART[id] || {};
  if (a.pest) return <PestIcon pest={a.pest} className={className} />;
  return <Glyph name={a.glyph || a.extra} className={className} />;
}

// ── Mouthparts figure (adapted from the Taijiang guide's mouthSVG, with the
//    rasping-sucking type added for thrips and the control consequence printed
//    under each panel). ───────────────────────────────────────────────────────
const MOUTH = [
  { k: 'chew', draw: '<circle cx="60" cy="40" r="22"/><path d="M48 58l-12 18M72 58l12 18M46 70c8-4 20-4 28 0"/><path d="M40 76l10-6M80 76l-10-6"/>' },
  { k: 'pierce', draw: '<circle cx="60" cy="36" r="20"/><path d="M60 56v32"/><path d="M60 88l-4-6M60 88l4-6"/>' },
  { k: 'rasp', draw: '<circle cx="60" cy="34" r="20"/><path d="M54 54l-4 26M66 54l2 18"/><path d="M44 82h20" stroke-dasharray="3 4"/>' },
  { k: 'siphon', draw: '<circle cx="60" cy="34" r="20"/><path d="M60 54c0 20-12 20-18 28 0 8 10 8 12 0"/>' },
  { k: 'sponge', draw: '<circle cx="60" cy="34" r="20"/><path d="M60 54v18"/><ellipse cx="60" cy="80" rx="16" ry="8"/>' },
];
const MOUTH_TEXT = {
  chew: { name: { en: 'Chewing', zh: '咀嚼式' }, who: { en: 'Caterpillars, beetles, grasshoppers', zh: '毛虫、甲虫、蝗虫' }, use: { en: 'Stomach poisons on the leaf (Bt, diamides, spinosyns)', zh: '叶面胃毒剂（Bt、双酰胺、多杀菌素）' } },
  pierce: { name: { en: 'Piercing-sucking', zh: '刺吸式' }, who: { en: 'Aphids, mealybugs, scales, bugs', zh: '蚜虫、粉蚧、介壳虫、蝽' }, use: { en: 'Systemic products that travel in the sap', zh: '随汁液传导的内吸性药剂' } },
  rasp: { name: { en: 'Rasping-sucking', zh: '锉吸式' }, who: { en: 'Thrips', zh: '蓟马' }, use: { en: 'Translaminar products that soak into buds', zh: '能渗入花蕾的渗透性药剂' } },
  siphon: { name: { en: 'Siphoning', zh: '虹吸式' }, who: { en: 'Adult moths — drink nectar, no damage', zh: '蛾类成虫——吸花蜜，不危害' }, use: { en: 'Target the eggs & larvae, not the moth', zh: '针对卵和幼虫，不是蛾子' } },
  sponge: { name: { en: 'Sponging', zh: '舐吸式' }, who: { en: 'Adult fruit flies', zh: '实蝇成虫' }, use: { en: 'Protein bait + spinosad spots', zh: '蛋白饵剂 + 多杀霉素点喷' } },
};

export function MouthpartsFigure({ t }) {
  const g = 'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {MOUTH.map(m => (
        <div key={m.k} className="rounded-xl border border-stone-200 bg-white p-2 text-center">
          <svg viewBox="0 0 120 96" className="w-full h-20 text-stone-800" aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<g ${g}>${m.draw}</g>` }} />
          <div className="font-bold text-[15px] text-stone-900">{t(MOUTH_TEXT[m.k].name)}</div>
          <div className="text-[13px] text-stone-600 leading-snug">{t(MOUTH_TEXT[m.k].who)}</div>
          <div className="text-[13px] text-emerald-800 font-semibold leading-snug mt-1">→ {t(MOUTH_TEXT[m.k].use)}</div>
        </div>
      ))}
    </div>
  );
}

// ── Life-cycle figure: which stage each kind of product hits. ───────────────
export function LifecycleFigure({ t }) {
  const row = (title, stages) => (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <div className="font-bold text-[15px] mb-2">{t(title)}</div>
      <div className="flex items-stretch gap-1">
        {stages.map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex-1 text-center">
              <div className={`rounded-lg py-2 text-[13px] font-bold ${s.hit ? 'bg-emerald-100 text-emerald-900 ring-2 ring-emerald-500' : 'bg-stone-100 text-stone-700'}`}>{t(s.name)}</div>
              {s.hit && <div className="text-[12px] text-emerald-800 mt-1 leading-tight">{t(s.hit)}</div>}
            </div>
            {i < stages.length - 1 && <div className="self-start pt-2 text-stone-400">→</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
  return (
    <div className="space-y-2">
      {row({ en: 'Complete change (moths, beetles, flies)', zh: '完全变态（蛾、甲虫、蝇）' }, [
        { name: { en: 'Egg', zh: '卵' } },
        { name: { en: 'Larva', zh: '幼虫' }, hit: { en: 'Does the damage — Bt, diamides, IGRs', zh: '造成危害——Bt、双酰胺、生长调节剂' } },
        { name: { en: 'Pupa', zh: '蛹' }, hit: { en: 'Hidden — sprays miss', zh: '隐蔽——喷药无效' } },
        { name: { en: 'Adult', zh: '成虫' } },
      ])}
      {row({ en: 'Gradual change (bugs, aphids, thrips)', zh: '不完全变态（蝽、蚜虫、蓟马）' }, [
        { name: { en: 'Egg', zh: '卵' } },
        { name: { en: 'Nymph', zh: '若虫' }, hit: { en: 'Growth regulators work here', zh: '生长调节剂在此有效' } },
        { name: { en: 'Adult', zh: '成虫' }, hit: { en: 'Needs an adult-killer', zh: '需要杀成虫的药剂' } },
      ])}
    </div>
  );
}
