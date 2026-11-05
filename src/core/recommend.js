// Recommendation engine: pest group + orchard context → ranked chemistry
// options (with real actives), a rotation plan, and the warnings that matter.

import { CHART_ROWS, CROSS_RESISTANCE_CLUSTERS, toxSev } from './moaDb.js';
import { CHEMICALS, moaInfo, moaKeyFromIrac, REMOVED } from './chemDb.js';
import { CHART_FOR_GROUP } from './rotation.js';

const FIT_SCORE = { best: 3, good: 2, limited: 1 };
const chemByEn = new Map(CHEMICALS.map(c => [c.name.en, c]));
const clusterOf = (irac) => CROSS_RESISTANCE_CLUSTERS.find(c => c.groups.includes(irac));

/** Actives for one MoA class, restricted to the rotation chart for this group when we have one. */
function activesFor(group, key) {
  const chart = CHART_FOR_GROUP[group.id];
  let list = [];
  if (chart) {
    const names = new Set(CHART_ROWS.filter(r => chart.includes(r.pest) && moaKeyFromIrac(r.g) === key).map(r => r.n));
    list = [...names].map(n => chemByEn.get(n)).filter(Boolean);
  }
  if (!list.length) list = CHEMICALS.filter(c => c.moa === key);
  // gentlest first: WHO class, then bee hazard
  const beeRank = { low: 0, wet: 1, mod: 1, high: 2 };
  return list.sort((a, b) => toxSev(a.name.en) - toxSev(b.name.en) || (beeRank[a.bee] ?? 0) - (beeRank[b.bee] ?? 0));
}

/**
 * @param {object} group – entry from GROUPS
 * @param {object} ctx   – { stage?: string, recentMoa?: string[] }  (MoA class keys)
 */
export function recommend(group, ctx = {}) {
  const { stage = null, recentMoa = [] } = ctx;
  const flowering = stage === 'flowering';
  const nearHarvest = stage === 'harvest';
  const recentIrac = recentMoa.filter(k => k.startsWith('IRAC ')).map(k => k.slice(5));

  const options = group.chem.map((c, index) => {
    const info = moaInfo(c.moa);
    const actives = activesFor(group, c.moa);
    const warnings = [];
    let score = FIT_SCORE[c.fit] ?? 1;

    if (info.bee === 'high') {
      if (flowering) { score -= 2; warnings.push('beeBlock'); } else warnings.push('beeHigh');
    } else if (info.bee === 'medium' && flowering) {
      score -= 0.5; warnings.push('beeEvening');
    }
    if (nearHarvest && info.kind !== 'bio' && info.kind !== 'physical') warnings.push('phi');
    if (info.resistance === 'high') warnings.push('resistance');

    const recentlyUsed = recentMoa.includes(c.moa);
    if (recentlyUsed) { score -= 1.5; warnings.push('rotate'); }
    // Cross-resistance: a different code that shares a target with what was used last.
    const irac = info.irac;
    if (!recentlyUsed && irac && recentIrac.some(r => {
      const cl = clusterOf(r); return cl && cl.groups.some(g => moaKeyFromIrac(g) === c.moa);
    })) { score -= 1; warnings.push('crossRes'); }

    return { ...c, moaInfo: info, actives, warnings, score, index, recentlyUsed };
  });

  options.sort((a, b) => b.score - a.score || a.index - b.index);

  // Rotation plan: up to 3 windows, each a different MoA, never two from the same
  // cross-resistance cluster, skipping anything blocked at this stage.
  const rotation = [];
  const usedClusters = new Set();
  for (const o of options) {
    if (rotation.length >= 3) break;
    if (o.warnings.includes('beeBlock') || o.recentlyUsed) continue;
    if (rotation.some(r => r.moa === o.moa)) continue;
    const cl = o.moaInfo.irac && clusterOf(o.moaInfo.irac === '10' ? '10A' : o.moaInfo.irac);
    if (cl && usedClusters.has(cl)) continue;
    if (cl) usedClusters.add(cl);
    rotation.push(o);
  }

  const avoid = (group.avoid || []).map(a => ({ ...a, moaInfo: moaInfo(a.moa) }));
  return { options, rotation, avoid };
}

/** Pest groups whose recommendations include this MoA class (for the chemical page). */
export function groupsForMoa(groups, key) {
  return groups.filter(g => g.chem.some(c => c.moa === key));
}

/** Removed (banned) actives that were used against this group — search notices only. */
export const removedForGroup = (gid) => REMOVED.filter(r => (r.groups || []).includes(gid));
