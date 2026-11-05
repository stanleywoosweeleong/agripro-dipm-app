// Simplified durian crop calendar. Used to (1) build the "watch now" list and
// (2) add stage-specific safety warnings to recommendations.

export const STAGES = [
  { id: 'vegetative', name: { en: 'Leaf flush', zh: '抽梢期' }, hint: { en: 'New leaves growing', zh: '新叶生长' } },
  { id: 'flowering', name: { en: 'Flowering', zh: '开花期' }, hint: { en: 'Buds to full bloom', zh: '花蕾至盛花' } },
  { id: 'fruit-set', name: { en: 'Fruit set', zh: '坐果期' }, hint: { en: 'Small fruitlets', zh: '小幼果' } },
  { id: 'fruit-growth', name: { en: 'Fruit growth', zh: '果实膨大期' }, hint: { en: 'Fruit expanding', zh: '果实膨大' } },
  { id: 'harvest', name: { en: 'Near harvest', zh: '临近采收' }, hint: { en: 'Last 4–6 weeks', zh: '最后4–6周' } },
  { id: 'post-harvest', name: { en: 'After harvest', zh: '采后恢复期' }, hint: { en: 'Pruning & recovery', zh: '修剪与恢复' } },
];

export const WEATHER = [
  { id: 'wet', name: { en: 'Rainy / humid', zh: '多雨 / 潮湿' } },
  { id: 'dry', name: { en: 'Hot & dry', zh: '炎热 / 干旱' } },
];

export const stageById = (id) => STAGES.find(s => s.id === id);
