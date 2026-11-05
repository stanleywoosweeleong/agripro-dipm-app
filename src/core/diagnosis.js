// Trait-based diagnosis.
//
// The farmer never needs to know the species. Three plain questions —
// WHERE is the problem, WHAT do you see, WHAT creature (if any) — each
// answer adds evidence for one or more pest groups. The engine returns the
// best-matching groups with the evidence that supports them.

import { GROUPS } from './groups.js';

export const PARTS = [
  { id: 'leaf', icon: 'leaf', name: { en: 'Leaves & new shoots', zh: '叶片与新梢' } },
  { id: 'flower', icon: 'flower', name: { en: 'Flowers', zh: '花' } },
  { id: 'fruit', icon: 'fruit', name: { en: 'Fruit', zh: '果实' } },
  { id: 'trunk', icon: 'trunk', name: { en: 'Trunk & branches', zh: '树干与枝条' } },
  { id: 'root', icon: 'root', name: { en: 'Roots / whole tree', zh: '根部 / 整株' } },
];

// Each sign: which parts it applies to, and evidence weights per group.
export const SIGNS = [
  // ─ leaves
  { id: 'curl', parts: ['leaf'], label: { en: 'New leaves curled, twisted or cupped', zh: '新叶卷曲、扭曲或呈杯状' }, w: { 'phloem-suckers': 3, mites: 2, thrips: 1 } },
  { id: 'sticky', parts: ['leaf', 'fruit', 'flower'], label: { en: 'Sticky shiny surface or black sooty coating', zh: '表面黏稠发亮或覆盖黑色煤烟' }, w: { 'phloem-suckers': 3, 'scale-mealybug': 3, 'ants-wasps': 1 } },
  { id: 'stipple', parts: ['leaf'], label: { en: 'Tiny pale or yellow speckles', zh: '细小的灰白或黄色斑点' }, w: { mites: 3, 'phloem-suckers': 1, thrips: 1 } },
  { id: 'silver', parts: ['leaf', 'flower'], label: { en: 'Silvery or bronze scarring', zh: '银白色或古铜色疤痕' }, w: { thrips: 3, mites: 2 } },
  { id: 'web-fine', parts: ['leaf'], label: { en: 'Very fine silk webbing on leaf underside', zh: '叶背有极细的丝网' }, w: { mites: 4 } },
  { id: 'holes', parts: ['leaf', 'flower'], label: { en: 'Holes or chewed edges', zh: '孔洞或被咬的叶缘' }, w: { 'leaf-caterpillars': 3, 'leaf-beetles': 3, snails: 1 } },
  { id: 'rolled', parts: ['leaf'], label: { en: 'Leaves rolled or tied with silk, with droppings', zh: '叶片被丝卷起或缀连，有虫粪' }, w: { 'leaf-caterpillars': 4 } },
  { id: 'night-damage', parts: ['leaf'], label: { en: 'Fresh damage each morning, nothing seen by day', zh: '每天早上有新危害，白天看不到虫' }, w: { 'leaf-beetles': 3, snails: 2, 'leaf-caterpillars': 1 } },
  { id: 'slime', parts: ['leaf', 'fruit'], label: { en: 'Shiny slime trails', zh: '发亮的黏液痕迹' }, w: { snails: 5 } },
  { id: 'spots-halo', parts: ['leaf', 'fruit', 'flower'], label: { en: 'Brown/black spots, often with yellow halo', zh: '褐/黑色斑点，常带黄晕' }, w: { 'leaf-spots': 3, bacterial: 1 } },
  { id: 'angular', parts: ['leaf'], label: { en: 'Angular water-soaked spots between veins', zh: '叶脉间的多角形水渍状斑' }, w: { bacterial: 4 } },
  { id: 'blight', parts: ['leaf', 'flower'], label: { en: 'Large dead patches spreading fast in wet weather', zh: '潮湿天气下迅速扩展的大片枯斑' }, w: { 'leaf-spots': 2, oomycete: 2 } },
  { id: 'rust-raised', parts: ['leaf'], label: { en: 'Raised orange-red velvety spots', zh: '凸起的橙红色绒状斑点' }, w: { 'leaf-spots': 3 } },
  { id: 'white-wax', parts: ['leaf', 'fruit', 'trunk', 'root'], label: { en: 'White cottony or waxy masses', zh: '白色棉絮状或蜡质团块' }, w: { 'scale-mealybug': 4, 'phloem-suckers': 1 } },
  { id: 'bumps', parts: ['leaf', 'trunk', 'fruit'], label: { en: 'Small bumps/shells stuck on twigs or leaves', zh: '枝叶上附着小凸起或硬壳' }, w: { 'scale-mealybug': 4 } },
  { id: 'ant-trail', parts: ['leaf', 'fruit', 'trunk', 'flower'], label: { en: 'Many ants running up and down', zh: '大量蚂蚁上下爬行' }, w: { 'scale-mealybug': 2, 'phloem-suckers': 2, 'ants-wasps': 2 } },
  // ─ flowers
  { id: 'flower-drop', parts: ['flower'], label: { en: 'Buds or flowers browning and dropping', zh: '花蕾或花朵变褐脱落' }, w: { thrips: 3, 'leaf-spots': 2, 'phloem-suckers': 1, mites: 1 } },
  // ─ fruit
  { id: 'fruit-frass', parts: ['fruit'], label: { en: 'Holes in rind with brown frass/sawdust', zh: '果皮有孔并带褐色虫粪/木屑' }, w: { 'fruit-borers': 5 } },
  { id: 'fruit-corky', parts: ['fruit'], label: { en: 'Corky, scabby brown scars on skin', zh: '果皮出现木栓化褐色疤痕' }, w: { thrips: 3, 'plant-bugs': 1, mites: 1 } },
  { id: 'fruit-sunken', parts: ['fruit'], label: { en: 'Dark sunken spots; fruitlets drop', zh: '深色凹陷斑；幼果脱落' }, w: { 'plant-bugs': 3, 'leaf-spots': 2 } },
  { id: 'fruit-rot', parts: ['fruit'], label: { en: 'Wet brown/black rot spreading from tip or stalk', zh: '从果顶或果柄扩展的湿腐褐/黑斑' }, w: { oomycete: 4, 'leaf-spots': 1 } },
  { id: 'fruit-maggot', parts: ['fruit'], label: { en: 'Soft flesh with small maggots', zh: '果肉软烂有小蛆' }, w: { 'fruit-flies': 5, 'fruit-borers': 1 } },
  { id: 'fruit-gnawed', parts: ['fruit'], label: { en: 'Fruit gnawed, torn open or missing', zh: '果实被啃咬、撕开或丢失' }, w: { vertebrates: 5 } },
  // ─ trunk
  { id: 'sawdust', parts: ['trunk'], label: { en: 'Sawdust or frass pushed out of a hole', zh: '孔口有推出的木屑或虫粪' }, w: { 'trunk-borers': 4, 'shot-hole': 2 } },
  { id: 'pinholes', parts: ['trunk'], label: { en: 'Many tiny holes (1–2 mm) with fine powder', zh: '许多小孔（1–2毫米）并有细粉' }, w: { 'shot-hole': 5 } },
  { id: 'branch-wilt', parts: ['trunk'], label: { en: 'One branch wilting beyond a hole or ring', zh: '某枝条在孔洞或环痕以外萎蔫' }, w: { 'trunk-borers': 3, 'canker-dieback': 2 } },
  { id: 'ooze', parts: ['trunk'], label: { en: 'Wet dark patch with reddish-brown ooze', zh: '湿润深色斑块并流出红褐色胶液' }, w: { oomycete: 5, 'canker-dieback': 1, 'shot-hole': 1 } },
  { id: 'dieback', parts: ['trunk', 'leaf'], label: { en: 'Twigs dying back from the tips', zh: '枝梢从顶端向下枯死' }, w: { 'canker-dieback': 4, oomycete: 1 } },
  { id: 'pink-crust', parts: ['trunk'], label: { en: 'Pink or white crust on branches', zh: '枝条上有粉红色或白色菌壳' }, w: { 'canker-dieback': 4 } },
  { id: 'mud-tubes', parts: ['trunk', 'root'], label: { en: 'Mud tubes or mud sheets on trunk', zh: '树干上有泥道或泥被' }, w: { 'soil-pests': 5 } },
  { id: 'bark-silk', parts: ['trunk'], label: { en: 'Bark eaten under silky frass ribbons', zh: '丝状虫粪带下的树皮被啃食' }, w: { 'trunk-borers': 4 } },
  { id: 'green-bark', parts: ['trunk'], label: { en: 'Green film, moss or ferns on bark', zh: '树皮上有绿色薄膜、苔藓或蕨类' }, w: { epiphytes: 5 } },
  { id: 'bark-stripped', parts: ['trunk', 'root'], label: { en: 'Bark gnawed or stripped near the base', zh: '树基附近树皮被啃或剥' }, w: { vertebrates: 5 } },
  // ─ root / whole tree
  { id: 'tree-wilt', parts: ['root'], label: { en: 'Whole tree yellowing, wilting or dropping leaves', zh: '整株发黄、萎蔫或落叶' }, w: { oomycete: 3, 'root-fungi': 2, 'soil-pests': 1, nematodes: 1, 'canker-dieback': 1 } },
  { id: 'white-threads', parts: ['root'], label: { en: 'White fungal threads stuck on roots', zh: '根上附着白色菌索' }, w: { 'root-fungi': 5 } },
  { id: 'galls', parts: ['root'], label: { en: 'Knots or swellings on roots', zh: '根上有结或肿大' }, w: { nematodes: 5 } },
  { id: 'roots-chewed', parts: ['root'], label: { en: 'Roots chewed; white C-shaped grubs in soil', zh: '根被啃食；土中有C形白色幼虫' }, w: { 'soil-pests': 5 } },
  { id: 'roots-rotten', parts: ['root'], label: { en: 'Roots dark, soft and peeling', zh: '根部变黑、变软、脱皮' }, w: { oomycete: 4 } },
  { id: 'soil-dug', parts: ['root'], label: { en: 'Soil dug up, roots exposed by animals', zh: '土壤被翻，根被动物刨出' }, w: { vertebrates: 4 } },
];

export const CULPRITS = [
  { id: 'soft-cluster', label: { en: 'Tiny soft insects in groups', zh: '成群的微小软体虫' }, w: { 'phloem-suckers': 4 } },
  { id: 'white-flies', label: { en: 'Tiny white flies rise when shaken', zh: '摇动时飞起微小白色飞虫' }, w: { 'phloem-suckers': 5 } },
  { id: 'jumpers', label: { en: 'Small wedge-shaped insects that jump sideways', zh: '横着跳的楔形小虫' }, w: { 'phloem-suckers': 4 } },
  { id: 'waxy-fixed', label: { en: 'White waxy or shell-like bugs that hardly move', zh: '几乎不动的白色蜡质或硬壳虫' }, w: { 'scale-mealybug': 5 } },
  { id: 'slender', label: { en: 'Very tiny slender insects (seen on white paper)', zh: '极小细长的虫（在白纸上可见）' }, w: { thrips: 5 } },
  { id: 'shield-bug', label: { en: 'Shield-shaped or long-legged bugs', zh: '盾形或长腿的蝽' }, w: { 'plant-bugs': 5 } },
  { id: 'caterpillar', label: { en: 'Caterpillar (soft larva with legs)', zh: '毛虫（有足的软体幼虫）' }, w: { 'leaf-caterpillars': 3, 'fruit-borers': 2, 'trunk-borers': 1 } },
  { id: 'grub', label: { en: 'White grub or legless larva in wood/soil', zh: '木头或土中的白色蛴螬或无足幼虫' }, w: { 'soil-pests': 3, 'trunk-borers': 3 } },
  { id: 'maggot', label: { en: 'Small legless maggots in fruit', zh: '果实里的无足小蛆' }, w: { 'fruit-flies': 5 } },
  { id: 'beetle', label: { en: 'Beetle (hard shiny wing covers)', zh: '甲虫（坚硬发亮的鞘翅）' }, w: { 'leaf-beetles': 3, 'shot-hole': 1, 'trunk-borers': 1 } },
  { id: 'grasshopper', label: { en: 'Grasshopper', zh: '蝗虫' }, w: { 'leaf-beetles': 5 } },
  { id: 'mite-dots', label: { en: 'Moving dots — need a magnifier', zh: '移动的小点——需放大镜' }, w: { mites: 5 } },
  { id: 'snail', label: { en: 'Snail or slug', zh: '蜗牛或蛞蝓' }, w: { snails: 5 } },
  { id: 'ants', label: { en: 'Ants', zh: '蚂蚁' }, w: { 'ants-wasps': 3, 'scale-mealybug': 1, 'phloem-suckers': 1 } },
  { id: 'wasps', label: { en: 'Wasps or hornets', zh: '胡蜂或马蜂' }, w: { 'ants-wasps': 5 } },
  { id: 'termites', label: { en: 'Termites (pale soft ants)', zh: '白蚁（浅色软体“蚂蚁”）' }, w: { 'soil-pests': 5 } },
  { id: 'animal', label: { en: 'Animal, bite or claw marks, droppings', zh: '动物、咬痕或爪痕、粪便' }, w: { vertebrates: 5 } },
  { id: 'nothing', label: { en: 'No creature — only the damage', zh: '没看到生物——只有危害症状' }, w: { oomycete: 1, 'canker-dieback': 1, 'leaf-spots': 1, 'root-fungi': 1, bacterial: 1, nematodes: 1, mites: 1, thrips: 1, 'fruit-borers': 1, 'shot-hole': 1 } },
  { id: 'unsure', label: { en: 'Not sure', zh: '不确定' }, w: {} },
];

export const signsForPart = (partIds) =>
  SIGNS.filter(s => s.parts.some(p => partIds.includes(p)));

const DISEASE_KINGDOMS = new Set(['disease']);

/**
 * Score all groups from the farmer's answers.
 * @param {{signs: string[], culprits: string[], weather?: 'wet'|'dry'|null}} answers
 * @returns {{group, score, pct, evidence: object[]}[]} sorted, best first
 */
export function diagnose({ signs = [], culprits = [], weather = null }) {
  const evidence = {};
  const scores = {};
  const add = (gid, w, item) => {
    scores[gid] = (scores[gid] || 0) + w;
    (evidence[gid] ||= []).push(item);
  };

  for (const sid of signs) {
    const s = SIGNS.find(x => x.id === sid);
    if (!s) continue;
    for (const [gid, w] of Object.entries(s.w)) add(gid, w, s);
  }
  for (const cid of culprits) {
    const c = CULPRITS.find(x => x.id === cid);
    if (!c) continue;
    for (const [gid, w] of Object.entries(c.w)) add(gid, w, c);
  }

  // A visible creature rules out "disease only", and vice versa.
  const sawCreature = culprits.some(c => c !== 'nothing' && c !== 'unsure');
  const sawNothing = culprits.includes('nothing');

  const results = GROUPS.map(g => {
    let score = scores[g.id] || 0;
    if (score === 0) return null;
    if (weather && g.weather === weather) score *= 1.2;
    if (sawCreature && DISEASE_KINGDOMS.has(g.kingdom)) score *= 0.6;
    if (sawNothing && !DISEASE_KINGDOMS.has(g.kingdom)) score *= 0.85;
    return { group: g, score, evidence: evidence[g.id] || [] };
  }).filter(Boolean);

  results.sort((a, b) => b.score - a.score);
  const total = results.reduce((s, r) => s + r.score, 0) || 1;
  const top = results[0]?.score || 1;
  return results.map(r => ({
    ...r,
    pct: Math.round((r.score / total) * 100),
    // confidence: how far ahead of the field this group is, and how much evidence overall
    confidence: r.score === top && r.score >= 6 && (results[1]?.score ?? 0) <= r.score * 0.6
      ? 'high'
      : r.score >= top * 0.75 && r.score >= 4 ? 'medium' : 'low',
  }));
}
