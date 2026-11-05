// Known durian pests (from the original catalogue) mapped onto pest groups.
// The catalogue is no longer the backbone — it supplies EXAMPLES and photos
// under each group. A new species only needs a line here, or nothing at all:
// the diagnosis still works through traits.

import { ALL_PESTS } from '../data/pests.js';

const MAP = {
  'phloem-suckers': ['aphid-nymph', 'aphid-adult', 'whitefly-nymph', 'whitefly-adult', 'psyllid-nymph', 'psyllid-adult', 'green-leafhopper-nymph', 'green-leafhopper-adult'],
  'scale-mealybug': ['durian-pit-scale-crawler', 'durian-pit-scale-adult', 'soft-scale', 'durian-mealybug-crawler', 'durian-mealybug-adult', 'coffee-mealybug'],
  thrips: ['thrips-nymph', 'thrips-adult'],
  'plant-bugs': ['leaf-footed-bug', 'stink-bug'],
  'leaf-caterpillars': ['bagworm', 'durian-leafroller', 'tussock-moth', 'durian-hawk-moth'],
  'leaf-beetles': ['chafer-beetle-adult', 'rose-chafer', 'gold-dust-weevil-adult', 'valanga-grasshopper-nymph', 'valanga-grasshopper-adult'],
  'fruit-borers': ['durian-fruit-borer-caterpillar', 'durian-fruit-borer-moth', 'durian-seed-borer-caterpillar', 'rind-borer', 'peach-moth', 'sap-beetle'],
  'fruit-flies': ['fruit-fly-maggot', 'fruit-fly-adult'],
  'trunk-borers': ['mango-stem-borer-larva', 'mango-stem-borer-adult', 'red-branch-borer', 'clearwing-moth', 'bark-eating-caterpillar', 'coconut-rhino-beetle-adult', 'malaysian-rhino-beetle-adult'],
  'shot-hole': ['pinhole-borer', 'ambrosia-beetle'],
  'soil-pests': ['chafer-beetle-grub', 'gold-dust-weevil-grub', 'subterranean-termite', 'coconut-rhino-beetle-grub'],
  'ants-wasps': ['weaver-ant', 'crazy-ant', 'paper-wasp', 'hornet', 'night-wasp'],
  mites: ['african-red-mite', 'oriental-red-mite', 'broad-mite', 'eriophyid-mite'],
  snails: ['giant-african-snail', 'slugs'],
  nematodes: ['root-knot-nematode', 'lesion-nematode'],
  oomycete: ['phytophthora', 'pythium-rot'],
  'canker-dieback': ['fusicoccum-canker', 'twig-blight', 'lasiodiplodia', 'ceratocystis', 'pink-disease'],
  'leaf-spots': ['anthracnose', 'leaf-blight', 'black-mildew', 'algal-leaf-spot', 'sooty-mold'],
  'root-fungi': ['white-root-disease'],
  bacterial: ['bacterial-leaf-spot'],
  vertebrates: ['civet', 'macaque', 'plantain-squirrel', 'porcupine', 'wild-boar', 'elephant', 'field-rat', 'sun-bear'],
  epiphytes: ['dragons-scale-fern', 'green-trunk-algae'],
};

const byId = new Map(ALL_PESTS.map(p => [p.id, p]));

export function examplesFor(groupId) {
  return (MAP[groupId] || []).map(id => byId.get(id)).filter(Boolean);
}

export function groupOfPest(pestId) {
  return Object.keys(MAP).find(g => MAP[g].includes(pestId)) || null;
}

/** Search the known-pest catalogue (both languages + scientific name). */
export function searchKnownPests(q) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return ALL_PESTS.filter(p =>
    p.common.en.toLowerCase().includes(s) || p.common.zh.includes(s) || p.scientific.toLowerCase().includes(s)
  ).map(p => ({ pest: p, groupId: groupOfPest(p.id) }));
}

export const MAPPED_IDS = new Set(Object.values(MAP).flat());
