// Unified chemical database.
//
//  • Insecticides & acaricides: the audited Pest-MoA rotation database (moaDb.js).
//  • Fungicides, extra biologicals, molluscicides: added here for durian diseases.
//  • Banned / highly hazardous actives are NOT in the browsable list. They only
//    answer a search (policy inherited from the rotation guide), with the reason
//    and a pointer to legal alternatives.
//
// The legal reference is always the Malaysian Pesticides Board (LRMP) register
// and the product label.

import {
  CHART_ROWS, CHEM_ZH, TOX_WHO, BEE_TAGS, BENEFICIAL_TAGS, FUNGUS_TAGS, ENV_TAGS,
  EU_BANNED, CHEM_FOODMATE_ID, REMOVED_MY, GROUP_NAMES, GROUP_MOA, GROUP_CROSS_RESISTANCE,
  CROSS_RESISTANCE_CLUSTERS, toxSev,
} from './moaDb.js';
import { MOA } from './moa.js';

export const LAST_REVIEWED = '2026-11';

/** IRAC sub-group code from the rotation DB → MoA class key used by the pest groups. */
export function moaKeyFromIrac(g) {
  if (g === '10A' || g === '10B') return 'IRAC 10';
  if (g === 'UN' || g === 'UNM') return 'IRAC UN';
  if (g === 'UNF') return 'BIO-INS';
  return `IRAC ${g}`;
}

const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ── Insecticides from the rotation chart, one entry per active ─────────────
const byName = new Map();
for (const r of CHART_ROWS) {
  let e = byName.get(r.n);
  if (!e) {
    e = {
      id: slug(r.n), source: 'chart', kind: r.g.startsWith('10') || ['12C', '19', '20D', '21A', '25A'].includes(r.g) ? 'acaricide' : 'insecticide',
      name: { en: r.n, zh: CHEM_ZH[r.n] || r.zh || r.n }, irac: r.g, moa: moaKeyFromIrac(r.g),
      site: r.s, mobility: r.m, translaminar: !!r.tl, twoWay: !!r.ud,
      risk: {}, notes: {}, chartPests: [],
      tox: TOX_WHO[r.n] || 'NL', bee: BEE_TAGS[r.n] || null, beneficial: BENEFICIAL_TAGS[r.n] || null,
      fungusCompat: FUNGUS_TAGS[r.n] || null, env: ENV_TAGS[r.n] || [], eu: EU_BANNED[r.n] || null,
      foodmateId: CHEM_FOODMATE_ID[r.n] || null,
    };
    byName.set(r.n, e);
  }
  e.risk[r.pest] = r.r;
  if (r.note) e.notes[r.pest] = r.note;
  e.chartPests.push(r.pest);
}
// Bt and Beauveria are biologicals even though they sit in the chart.
for (const e of byName.values()) if (e.irac === '11A' || e.irac === 'UNF') e.kind = 'bio';

// ── Non-insecticide actives (durian diseases, extra biologicals, others) ──
const X = (id, en, zh, moa, kind, extra = {}) => ({
  id, source: 'local', kind, name: { en, zh }, moa, irac: null, risk: {}, notes: {}, chartPests: [],
  tox: extra.tox || 'NL', bee: extra.bee || 'low', beneficial: null, fungusCompat: null, env: extra.env || [],
  eu: extra.eu || null, foodmateId: null, aliases: extra.aliases || [], caution: extra.caution || null,
});
const LOCAL = [
  X('metarhizium', 'Metarhizium anisopliae', '绿僵菌', 'BIO-INS', 'bio', { env: ['bio'] }),
  X('isaria', 'Cordyceps (Isaria) fumosorosea', '玫烟色棒束孢', 'BIO-INS', 'bio', { env: ['bio'], aliases: ['isaria', 'paecilomyces'] }),
  X('lecanicillium', 'Lecanicillium lecanii', '蜡蚧轮枝菌', 'BIO-INS', 'bio', { env: ['bio'], aliases: ['verticillium'] }),
  X('steinernema', 'Steinernema / Heterorhabditis nematodes', '斯氏/异小杆线虫', 'BIO-NEM', 'bio', { aliases: ['nematode', 'epn', '昆虫病原线虫'] }),
  X('spiromesifen', 'Spiromesifen', '螺甲螨酯', 'IRAC 23', 'acaricide'),
  X('sulfur', 'Sulfur (wettable)', '硫磺', 'SULFUR', 'acaricide', { aliases: ['sulphur'] }),
  X('soap', 'Insecticidal soap', '杀虫皂', 'IRAC UN', 'insecticide'),
  X('carbendazim', 'Carbendazim', '多菌灵', 'FRAC 1', 'fungicide', { caution: 'export', eu: { en: 'Not approved in the EU', zh: '欧盟未批准使用' } }),
  X('thiophanate-methyl', 'Thiophanate-methyl', '甲基硫菌灵', 'FRAC 1', 'fungicide'),
  X('hexaconazole', 'Hexaconazole', '己唑醇', 'FRAC 3', 'fungicide'),
  X('difenoconazole', 'Difenoconazole', '苯醚甲环唑', 'FRAC 3', 'fungicide'),
  X('propiconazole', 'Propiconazole', '丙环唑', 'FRAC 3', 'fungicide'),
  X('tebuconazole', 'Tebuconazole', '戊唑醇', 'FRAC 3', 'fungicide'),
  X('prochloraz', 'Prochloraz', '咪鲜胺', 'FRAC 3', 'fungicide'),
  X('metalaxyl', 'Metalaxyl-M (mefenoxam)', '精甲霜灵', 'FRAC 4', 'fungicide', { aliases: ['metalaxyl', 'mefenoxam', '甲霜灵'] }),
  X('azoxystrobin', 'Azoxystrobin', '嘧菌酯', 'FRAC 11', 'fungicide'),
  X('pencycuron', 'Pencycuron', '戊菌隆', 'FRAC 20', 'fungicide'),
  X('cyazofamid', 'Cyazofamid', '氰霜唑', 'FRAC 21', 'fungicide'),
  X('dimethomorph', 'Dimethomorph', '烯酰吗啉', 'FRAC 40', 'fungicide'),
  X('phosphonate', 'Phosphorous acid / potassium phosphonate', '亚磷酸 / 亚磷酸钾', 'FRAC P07', 'fungicide', { aliases: ['phosphonic', 'phosphite'] }),
  X('fosetyl', 'Fosetyl-aluminium', '三乙膦酸铝', 'FRAC P07', 'fungicide', { aliases: ['fosetyl', '乙磷铝'] }),
  X('copper', 'Copper hydroxide / oxychloride', '氢氧化铜 / 氧氯化铜', 'FRAC M01', 'fungicide', { aliases: ['copper', 'bordeaux', '波尔多液', '铜'] }),
  X('mancozeb', 'Mancozeb', '代森锰锌', 'FRAC M03', 'fungicide'),
  X('propineb', 'Propineb', '丙森锌', 'FRAC M03', 'fungicide'),
  X('trichoderma', 'Trichoderma spp.', '木霉菌', 'BIO-FUN', 'bio'),
  X('bacillus-subtilis', 'Bacillus subtilis / amyloliquefaciens', '枯草/解淀粉芽孢杆菌', 'BIO-FUN', 'bio'),
  X('iron-phosphate', 'Iron phosphate (snail bait)', '磷酸铁', 'MOLL', 'molluscicide'),
  X('metaldehyde', 'Metaldehyde (snail bait)', '四聚乙醛', 'MOLL', 'molluscicide', { caution: 'pets' }),
  X('glufosinate', 'Glufosinate-ammonium', '草铵膦', 'HRAC 10', 'herbicide'),
];

// WHO Class Ia/Ib (extremely / highly hazardous) actives are EXCLUDED from all
// advice by default — there is almost always a less hazardous option.
// HHP_EXCEPTIONS are deliberate, documented exceptions: actives growers in
// Malaysia still depend on, whose farm formulations are far more dilute than
// the technical material WHO classifies. They stay in, with a handling note.
export const WHO_EXCLUDED = new Set(['Ia', 'Ib']);
export const HHP_EXCEPTIONS = {
  Abamectin: {
    en: 'The pure technical active is WHO class Ib. Farm products (e.g. 1.8% EC) are much more dilute and are usually labelled lower — check the signal word on your label. Wear gloves and a mask when mixing, keep it out of drains and ponds (very toxic to fish), never spray during flowering, and spray late in the day (sunlight breaks it down).',
    zh: '原药为WHO Ib类。农用制剂（如1.8%乳油）浓度低得多，标签等级通常较低——请查看标签上的信号词。配药时戴手套和口罩，远离水沟和池塘（对鱼剧毒），开花期禁用，傍晚施药（阳光会分解）。',
  },
};
const isHHP = (name) => WHO_EXCLUDED.has(TOX_WHO[name] || 'NL') && !HHP_EXCEPTIONS[name];
const excludedHHP = [...byName.values()].filter(c => isHHP(c.name.en));

export const CHEMICALS = [...byName.values(), ...LOCAL].filter(c => !isHHP(c.name.en));
for (const c of CHEMICALS) if (HHP_EXCEPTIONS[c.name.en]) c.hhpNote = HHP_EXCEPTIONS[c.name.en];

/** Chart rows usable for advice and rotation (WHO Ia/Ib removed). */
export const USABLE_ROWS = CHART_ROWS.filter(r => !isHHP(r.n));

// ── Organic / biological toolbox ───────────────────────────────────────────
// Actives generally allowed under organic standards (e.g. OMRI-listed, EU
// organic Annex I). The product's OWN certification is what counts — a
// formulation can carry non-organic co-formulants.
export const ORGANIC_IDS = new Set([
  'bacillus-thuringiensis', 'beauveria-bassiana', 'metarhizium', 'isaria', 'lecanicillium', 'steinernema',
  'azadirachtin', 'white-oil', 'soap', 'spinosad', 'sulfur', 'copper', 'trichoderma', 'bacillus-subtilis', 'iron-phosphate',
]);
for (const c of CHEMICALS) c.organic = ORGANIC_IDS.has(c.id);

export const ORGANIC_NOTE = {
  default: { en: 'Generally allowed in organic farming (e.g. OMRI, EU organic). Check the certification of the product you buy.', zh: '一般可用于有机种植（如OMRI、欧盟有机标准）。请确认所购产品本身的有机认证。' },
  copper: { en: 'Allowed in organic farming with limits on total copper per year — it builds up in soil. Use the lowest effective rate.', zh: '有机种植可用，但每年铜总用量有限制——铜会在土壤中累积。使用最低有效剂量。' },
  spinosad: { en: 'Fermentation product allowed in organic farming. Its relative spinetoram is NOT organic. Still rotate — thrips and caterpillars can resist spinosyns.', zh: '发酵产物，可用于有机种植。同类的乙基多杀菌素不属于有机。仍需轮换——蓟马和毛虫可对多杀菌素类产生抗性。' },
};
export const organicNote = (c) => ORGANIC_NOTE[c.id] || ORGANIC_NOTE.default;

export const CAUTION_TEXT = {
  export: { en: 'Not approved in the EU and under tight residue limits in several markets — check your buyer\'s requirements before using near harvest.', zh: '欧盟未批准，多个市场残留限量严格——临近采收使用前请确认买家要求。' },
  pets: { en: 'Poisonous to dogs, cats and wildlife. Prefer iron-phosphate baits.', zh: '对狗、猫和野生动物有毒。优先使用磷酸铁饵剂。' },
};

// ── Search-only notices for banned / highly hazardous actives ──────────────
// REMOVED_MY (verified Malaysian bans) comes first; the extra entries below are
// global bans (Stockholm POPs), paraquat, and WHO Ia/Ib actives still seen in
// the trade. None of these can be browsed, rotated or recommended.
const EXTRA_REMOVED = [
  { terms: ['ddt', '滴滴涕'], en: 'DDT', zh: '滴滴涕',
    basisEn: 'Persistent Organic Pollutant — banned for agriculture worldwide (Stockholm Convention).', basisZh: '持久性有机污染物——全球禁止农用（斯德哥尔摩公约）。', groups: ['leaf-caterpillars'] },
  { terms: ['lindane', 'gamma-hch', 'bhc', '林丹', '六六六'], en: 'Lindane (HCH)', zh: '林丹（六六六）',
    basisEn: 'Persistent Organic Pollutant — banned worldwide (Stockholm Convention).', basisZh: '持久性有机污染物——全球禁用（斯德哥尔摩公约）。', groups: ['soil-pests', 'trunk-borers'] },
  { terms: ['chlordane', 'heptachlor', 'aldrin', 'dieldrin', 'mirex', '氯丹', '七氯', '艾氏剂', '狄氏剂', '灭蚁灵'], en: 'Chlordane / heptachlor / aldrin / dieldrin / mirex', zh: '氯丹 / 七氯 / 艾氏剂 / 狄氏剂 / 灭蚁灵',
    basisEn: 'Persistent Organic Pollutants — banned worldwide (Stockholm Convention).', basisZh: '持久性有机污染物——全球禁用（斯德哥尔摩公约）。', groups: ['soil-pests', 'ants-wasps'] },
  { terms: ['paraquat', 'gramoxone', '百草枯', '克芜踪'], en: 'Paraquat', zh: '百草枯',
    basisEn: 'Banned in Malaysia since 1 January 2020. No antidote — a mouthful can kill. Use glufosinate per label, slashing or cover crops.', basisZh: '马来西亚自2020年1月1日起禁用。无解毒剂——误服一口即可致命。请改用按标签使用的草铵膦、割草或覆盖作物。', groups: [] },
  { terms: ['monocrotophos', '久效磷'], en: 'Monocrotophos', zh: '久效磷',
    basisEn: 'WHO class Ib (highly hazardous); banned or withdrawn in many countries. Do not use — check LRMP registration.', basisZh: 'WHO Ib类（高毒）；已在多国禁用或撤销。切勿使用——请核查LRMP登记。', groups: ['phloem-suckers', 'scale-mealybug'] },
  { terms: ['parathion', 'methyl parathion', '1605', '对硫磷', '甲基对硫磷'], en: 'Parathion / methyl parathion', zh: '对硫磷 / 甲基对硫磷',
    basisEn: 'WHO class Ia (extremely hazardous); banned or withdrawn in many countries. Do not use.', basisZh: 'WHO Ia类（极高毒）；已在多国禁用或撤销。切勿使用。', groups: ['phloem-suckers', 'leaf-caterpillars'] },
  { terms: ['dichlorvos', 'ddvp', '敌敌畏'], en: 'Dichlorvos (DDVP)', zh: '敌敌畏',
    basisEn: 'WHO class Ib (highly hazardous). Do not use on crops — check LRMP registration.', basisZh: 'WHO Ib类（高毒）。切勿用于作物——请核查LRMP登记。', groups: ['fruit-flies', 'leaf-caterpillars'] },
  { terms: ['carbofuran', 'furadan', '克百威', '呋喃丹'], en: 'Carbofuran', zh: '克百威（呋喃丹）',
    basisEn: 'WHO class Ib (highly hazardous); poisons birds and soil life. Do not use — check LRMP registration.', basisZh: 'WHO Ib类（高毒）；毒杀鸟类和土壤生物。切勿使用——请核查LRMP登记。', groups: ['nematodes', 'soil-pests', 'trunk-borers'] },
];

// The rotation guide records the CHART pests each removed active was used on;
// translate those to pest groups so the notice can point to legal options.
const CHART_TO_GROUPS = {
  leafhopper: ['phloem-suckers'], psyllid: ['phloem-suckers'], mealybug: ['scale-mealybug'],
  thrips: ['thrips'], spider_mite: ['mites'], caterpillar: ['leaf-caterpillars', 'fruit-borers'], grasshopper: ['leaf-beetles'],
};
export const REMOVED = [
  ...REMOVED_MY.map(r => ({ ...r, my: true, groups: [...new Set(r.pests.flatMap(p => CHART_TO_GROUPS[p] || []))] })),
  ...excludedHHP.map(c => ({
    terms: [c.name.en.toLowerCase(), c.name.zh], en: c.name.en, zh: c.name.zh, hhp: true,
    basisEn: `WHO class ${c.tox} (highly hazardous to people). This app does not recommend it — the options below work without that risk.`,
    basisZh: `WHO ${c.tox}类（对人高毒）。本应用不推荐使用——下列选项同样有效且没有这种风险。`,
    groups: [...new Set(c.chartPests.flatMap(p => CHART_TO_GROUPS[p] || []))],
  })),
  ...EXTRA_REMOVED,
];

export function findRemovedActive(q) {
  const s = (q || '').trim().toLowerCase();
  if (s.length < 3 && !/[一-鿿]{2}/.test(s)) return null;
  return REMOVED.find(r => r.terms.some(term => term.includes(s) || s.includes(term))) || null;
}

// ── Lookups ────────────────────────────────────────────────────────────────
export const chemById = (id) => CHEMICALS.find(c => c.id === id);
export const chemsForMoa = (key) => CHEMICALS.filter(c => c.moa === key);

export function searchChemicals(query, kind = 'all') {
  const q = query.trim().toLowerCase();
  return CHEMICALS
    .filter(c => kind === 'all' || (kind === 'organic' ? c.organic : c.kind === kind || (kind === 'insecticide' && c.kind === 'acaricide')))
    .filter(c => !q ||
      c.name.en.toLowerCase().includes(q) || c.name.zh.includes(q) ||
      (c.aliases || []).some(a => a.toLowerCase().includes(q)) ||
      (c.irac && (`irac ${c.irac}`.toLowerCase().includes(q) || c.irac.toLowerCase() === q)) ||
      c.moa.toLowerCase().includes(q))
    .sort((a, b) => a.name.en.localeCompare(b.name.en));
}

// Life stages killed, for IRAC classes that only exist in the rotation chart
// (classes with a plain-language entry in moa.js carry their own `stages`).
// Conservative: a stage is listed only where activity is well established.
const STAGES_EXTRA = {
  '4E': ['young', 'adult'], '7B': ['egg', 'young'], '9D': ['young', 'adult'], '13': ['young', 'adult'],
  '18': ['young'], '19': ['young', 'adult'], '20D': ['young', 'adult'], '21A': ['young', 'adult'],
  '21B': ['young', 'adult'], '22B': ['young', 'adult'], '25A': ['egg', 'young', 'adult'],
  '30': ['young', 'adult'], '36': ['young', 'adult'],
};

/** Class-level info for a MoA key: our plain-language entry + the rotation guide's detail. */
export function moaInfo(key) {
  const base = MOA[key];
  const irac = key.startsWith('IRAC ') ? key.slice(5) : null;
  const detailCode = irac === '10' ? '10A' : irac;
  const members = chemsForMoa(key);
  const fallbackName = irac && GROUP_NAMES.en[irac] ? { en: GROUP_NAMES.en[irac], zh: GROUP_NAMES.zh[irac] } : { en: key, zh: key };
  const beeRank = { high: 3, wet: 2, mod: 2, low: 1 };
  const worstBee = members.reduce((w, c) => (beeRank[c.bee] || 0) > (beeRank[w] || 0) ? c.bee : w, null);
  return {
    key, irac,
    kind: base?.kind || 'insecticide',
    name: base?.name || fallbackName,
    how: base?.how || null,
    detail: detailCode && GROUP_MOA.en[detailCode] ? { en: GROUP_MOA.en[detailCode], zh: GROUP_MOA.zh[detailCode] } : null,
    crossRes: detailCode && GROUP_CROSS_RESISTANCE.en[detailCode] ? { en: GROUP_CROSS_RESISTANCE.en[detailCode], zh: GROUP_CROSS_RESISTANCE.zh[detailCode] } : null,
    route: base?.route || [],
    stages: base?.stages || STAGES_EXTRA[irac] || [],
    bee: base?.bee || (worstBee === 'high' ? 'high' : worstBee === 'wet' || worstBee === 'mod' ? 'medium' : 'low'),
    resistance: base?.resistance || 'medium',
    note: base?.note || null,
  };
}

export { CROSS_RESISTANCE_CLUSTERS, toxSev };
