import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GROUPS } from '../src/core/groups.js';
import { CHEMICALS, REMOVED, findRemovedActive, moaInfo, searchChemicals, HHP_EXCEPTIONS } from '../src/core/chemDb.js';
import { REMOVED_MY, CHART_ROWS, EU_BANNED, BEE_TAGS, TOX_WHO } from '../src/core/moaDb.js';
import { SIGNS, CULPRITS, diagnose } from '../src/core/diagnosis.js';
import { recommend } from '../src/core/recommend.js';
import { rotationFor, groupsForChartPest, CHART_FOR_GROUP } from '../src/core/rotation.js';
import { MAPPED_IDS } from '../src/core/examples.js';
import { ALL_PESTS } from '../src/data/pests.js';
import { LESSONS } from '../src/core/lessons.js';

const groupIds = new Set(GROUPS.map(g => g.id));
const bi = (f, where) => assert.ok(f && f.en && f.zh, `missing en/zh: ${where}`);

test('every group is bilingual and never recommends what it says to avoid', () => {
  for (const g of GROUPS) {
    bi(g.name, g.id); bi(g.why, g.id); bi(g.scout, g.id);
    for (const c of g.chem) { bi(c.why, `${g.id}/${c.moa}`); bi(moaInfo(c.moa).name, c.moa); }
    for (const n of g.nonChem) bi(n, g.id);
    const avoid = new Set(g.avoid.map(a => a.moa));
    for (const c of g.chem) assert.ok(!avoid.has(c.moa), `${g.id}: ${c.moa} both recommended and avoided`);
  }
});

test('every recommended MoA class has at least one real active', () => {
  for (const g of GROUPS) for (const o of recommend(g).options)
    assert.ok(o.actives.length > 0, `${g.id}: ${o.moa} has no actives`);
});

test('rotation-guide invariant: nothing removed in Malaysia is browsable or recommended', () => {
  const removedNames = REMOVED.flatMap(r => r.terms);
  for (const c of CHEMICALS) {
    const n = c.name.en.toLowerCase();
    assert.ok(!removedNames.some(t => n === t || n.startsWith(t + ' ')), `${c.id} is a removed active`);
  }
  for (const r of REMOVED_MY) assert.ok(!CHART_ROWS.some(a => a.n.toLowerCase() === r.en.toLowerCase()), r.en);
});

test('banned search answers instead of "no matches"', () => {
  for (const q of ['chlorpyrifos', '毒死蜱', 'paraquat', '百草枯', 'endosulfan', 'methomyl', 'carbofuran'])
    assert.ok(findRemovedActive(q), q);
  assert.equal(findRemovedActive('spinosad'), null);
  assert.ok(searchChemicals('吡虫啉').length === 1);
});

test('lookup maps only name actives that exist', () => {
  const names = new Set(CHART_ROWS.map(c => c.n).concat(CHEMICALS.map(c => c.name.en)));
  for (const m of [EU_BANNED, BEE_TAGS, TOX_WHO]) for (const k of Object.keys(m)) assert.ok(names.has(k), k);
});

test('the merged database keeps all 69 chart actives', () => {
  assert.equal(new Set(CHART_ROWS.map(r => r.n)).size, 69);
  // 69 in the chart, minus WHO Ia/Ib exclusions (formetanate); abamectin is a documented exception
  assert.equal(CHEMICALS.filter(c => c.source === 'chart').length, 68);
});

test('diagnosis weights point at real groups', () => {
  for (const s of [...SIGNS, ...CULPRITS]) for (const gid of Object.keys(s.w)) assert.ok(groupIds.has(gid), `${s.id}: ${gid}`);
});

test('every catalogued pest is mapped to a group', () => {
  assert.deepEqual(ALL_PESTS.filter(p => !MAPPED_IDS.has(p.id)).map(p => p.id), []);
});

test('classic cases diagnose correctly', () => {
  const top = a => diagnose(a)[0]?.group.id;
  assert.equal(top({ signs: ['ooze'], culprits: ['nothing'] }), 'oomycete');
  assert.equal(top({ signs: ['curl', 'sticky'], culprits: ['soft-cluster'] }), 'phloem-suckers');
  assert.equal(top({ signs: ['stipple', 'web-fine'], culprits: ['mite-dots'] }), 'mites');
  assert.equal(top({ signs: ['fruit-frass'], culprits: ['caterpillar'] }), 'fruit-borers');
  assert.equal(top({ signs: ['white-wax', 'ant-trail'], culprits: ['waxy-fixed'] }), 'scale-mealybug');
  assert.equal(top({ signs: ['pinholes'], culprits: ['unsure'] }), 'shot-hole');
  assert.equal(top({ signs: ['silver', 'flower-drop'], culprits: ['slender'] }), 'thrips');
  assert.equal(top({ signs: ['angular'], culprits: ['nothing'] }), 'bacterial');
});

test('flowering keeps bee-toxic classes out of the rotation; no repeated cluster', () => {
  for (const g of GROUPS) {
    const r = recommend(g, { stage: 'flowering' });
    assert.ok(r.rotation.every(o => o.moaInfo.bee !== 'high'), g.id);
    assert.equal(new Set(r.rotation.map(o => o.moa)).size, r.rotation.length);
  }
});

test('oomycete advice never suggests fungicides that do not work on water moulds', () => {
  const codes = GROUPS.find(x => x.id === 'oomycete').chem.map(c => c.moa);
  assert.ok(!codes.includes('FRAC 1') && !codes.includes('FRAC 3'));
});

test('rotation helper: never suggests the same group or a shared-target sibling', () => {
  for (const pest of new Set(Object.values(CHART_FOR_GROUP).flat())) {
    for (const g of groupsForChartPest(pest)) {
      const r = rotationFor(pest, g);
      assert.ok(!r.suggested.some(s => s.g === g));
      for (const c of r.caution) assert.ok(!r.suggested.some(s => s.g === c.g));
    }
  }
  const r = rotationFor('psyllid', '4A');
  assert.ok(r.caution.some(c => c.g === '4C'));
  assert.equal(r.crossKind, 'partial');
});

test('lessons are bilingual with matching paragraph counts', () => {
  for (const l of LESSONS) { bi(l.title, l.id); assert.equal(l.body.en.length, l.body.zh.length, l.id); }
});

test('organic track shows only organic actives; conventional shows none of them', () => {
  for (const g of GROUPS) {
    for (const o of recommend(g, { track: 'organic' }).options) assert.ok(o.actives.every(a => a.organic), `${g.id}/${o.moa}`);
    for (const o of recommend(g, { track: 'conventional' }).options) assert.ok(o.actives.every(a => !a.organic), `${g.id}/${o.moa}`);
  }
  // spinetoram is NOT organic even though spinosad is
  assert.equal(CHEMICALS.find(c => c.id === 'spinetoram').organic, false);
  assert.equal(CHEMICALS.find(c => c.id === 'spinosad').organic, true);
});

test('most groups with any chemistry also have an organic option', () => {
  const missing = GROUPS.filter(g => g.chem.length && !recommend(g, { track: 'organic' }).options.length).map(g => g.id);
  assert.deepEqual(missing, ['ants-wasps']);
});

test('WHO Ia/Ib actives are never offered unless a documented exception', () => {
  const ok = (c) => !['Ia', 'Ib'].includes(c.tox) || !!HHP_EXCEPTIONS[c.name.en];
  assert.ok(CHEMICALS.every(ok));
  assert.ok(CHEMICALS.find(c => c.id === 'abamectin')?.hhpNote, 'abamectin kept with a handling note');
  assert.ok(!CHEMICALS.some(c => c.id === 'formetanate-hydrochloride'));
  for (const g of GROUPS) for (const tr of ['organic', 'conventional'])
    for (const o of recommend(g, { track: tr }).options) assert.ok(o.actives.every(ok));
  for (const pest of new Set(Object.values(CHART_FOR_GROUP).flat()))
    for (const g of groupsForChartPest(pest)) {
      const r = rotationFor(pest, g);
      for (const grp of [...r.suggested, ...r.caution]) for (const it of grp.items) assert.ok(!['Ia', 'Ib'].includes(TOX_WHO[it.n]) || HHP_EXCEPTIONS[it.n], it.n);
    }
  assert.ok(findRemovedActive('formetanate')?.hhp);
  assert.equal(findRemovedActive('abamectin'), null);
});

test('chart pests only get actives the chart lists for them (plus organic oils/neem/fungi)', () => {
  const mites = recommend(GROUPS.find(g => g.id === 'mites'), { track: 'all' });
  const ids = mites.options.flatMap(o => o.actives.map(a => a.id));
  assert.ok(!ids.includes('pyridalyl'));
  assert.ok(ids.includes('white-oil') && ids.includes('sulfur') && ids.includes('abamectin'));
});

test('life stage steers the ranking', () => {
  const sap = GROUPS.find(g => g.id === 'scale-mealybug');
  const pos = (r, moa) => r.options.findIndex(o => o.moa === moa);
  const young = recommend(sap, { pestStage: 'young' });
  const adults = recommend(sap, { pestStage: 'adults' });
  // buprofezin (IRAC 16) only kills crawlers/nymphs
  assert.ok(young.options.find(o => o.moa === 'IRAC 16').warnings.includes('youngBest'));
  assert.ok(adults.options.find(o => o.moa === 'IRAC 16').warnings.includes('noAdults'));
  assert.ok(pos(adults, 'IRAC 16') > pos(young, 'IRAC 16'));
  const mites = recommend(GROUPS.find(g => g.id === 'mites'), { pestStage: 'eggs' });
  assert.ok(mites.options.find(o => o.moa === 'IRAC 10').warnings.includes('ovicide'));
  // every insect/mite class we recommend declares which stages it kills
  for (const g of GROUPS.filter(g => g.kingdom === 'insect' || g.kingdom === 'mite'))
    for (const o of recommend(g).options.filter(o => o.moaInfo.kind !== 'fungicide')) assert.ok(o.moaInfo.stages.length, `${g.id}/${o.moa}`);
});
