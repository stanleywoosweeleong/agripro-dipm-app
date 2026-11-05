// Rotation Helper — ported from the Pest-MoA rotation guide.
// Given a chart pest and the IRAC group sprayed last, split the options into:
//   avoid    – same group (same target)
//   caution  – different code but SHARED target (cross-resistance cluster)
//   suggested – real mechanism changes, ranked: different target SITE first,
//               then gentler toxicity, then more low-resistance-risk actives.

import { CHART_ROWS, CROSS_RESISTANCE_CLUSTERS, isBanned, groupSite, toxSev, CHART_PESTS } from './moaDb.js';
import { CHEMICALS, USABLE_ROWS } from './chemDb.js';

const chemByEn = new Map(CHEMICALS.map(c => [c.name.en, c]));
export { CHART_PESTS };

/** Chart pests a pest-group can use for rotation. */
export const CHART_FOR_GROUP = {
  'phloem-suckers': ['leafhopper', 'psyllid'],
  'scale-mealybug': ['mealybug'],
  thrips: ['thrips'],
  mites: ['spider_mite'],
  'leaf-caterpillars': ['caterpillar'],
  'fruit-borers': ['caterpillar'],
  'leaf-beetles': ['grasshopper'],
};
export const GROUP_FOR_CHART = {
  leafhopper: 'phloem-suckers', psyllid: 'phloem-suckers', mealybug: 'scale-mealybug', thrips: 'thrips',
  spider_mite: 'mites', caterpillar: 'leaf-caterpillars', grasshopper: 'leaf-beetles',
};

const iracOrder = (a, b) => {
  const A = a.startsWith('UN') ? 999 : parseInt(a, 10);
  const B = b.startsWith('UN') ? 999 : parseInt(b, 10);
  return A - B || a.localeCompare(b);
};

export function groupsForChartPest(pest) {
  return [...new Set(USABLE_ROWS.filter(a => a.pest === pest && !isBanned(a.n)).map(a => a.g))].sort(iracOrder);
}

export function rotationFor(pest, lastGroup) {
  if (!lastGroup) return null;
  const pool = USABLE_ROWS.filter(a => a.pest === pest && !isBanned(a.n));
  const groupsAvail = [...new Set(pool.map(a => a.g))];
  const selectedSite = groupSite(lastGroup, CHART_ROWS);
  const cluster = CROSS_RESISTANCE_CLUSTERS.find(c => c.groups.includes(lastGroup));
  const crossGroups = cluster ? cluster.groups.filter(g => g !== lastGroup) : [];
  const withChem = (a) => ({ ...a, chem: chemByEn.get(a.n) });

  const buildGroup = (g) => {
    const items = pool.filter(a => a.g === g).slice().sort((x, y) => toxSev(x.n) - toxSev(y.n)).map(withChem);
    const lowRiskCount = items.filter(x => x.r === 'low').length;
    const bestTier = ['low', 'mid', 'high'].find(tier => items.some(x => x.r === tier)) || null;
    const site = groupSite(g, CHART_ROWS);
    const sevs = items.map(x => toxSev(x.n));
    return {
      g, items, lowRiskCount, bestTier, site,
      differentSite: site !== selectedSite ? 1 : 0,
      toxBest: sevs.length ? Math.min(...sevs) : 0,
      toxWorst: sevs.length ? Math.max(...sevs) : 0,
    };
  };

  const suggested = groupsAvail
    .filter(g => g !== lastGroup && !crossGroups.includes(g))
    .map(buildGroup)
    .sort((a, b) =>
      (b.differentSite - a.differentSite) || (a.toxBest - b.toxBest) || (a.toxWorst - b.toxWorst) || (b.lowRiskCount - a.lowRiskCount));
  const caution = groupsAvail.filter(g => crossGroups.includes(g)).map(buildGroup);
  const avoid = pool.filter(a => a.g === lastGroup).map(withChem);
  return { suggested, caution, crossKind: cluster ? cluster.kind : null, avoid, selectedSite };
}
