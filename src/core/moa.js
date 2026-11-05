// Mode-of-Action (MoA) classes — the backbone of chemical selection.
//
// Manufacturers and regulators do not reason species-by-species. They reason by
// (1) what the chemistry disrupts inside the pest (IRAC / FRAC group), and
// (2) how it reaches the pest (contact, ingestion, translaminar, systemic).
// A pest we have never catalogued can still be matched to the right classes by
// its feeding style, hiding place and life stage.
//
// route values:
//   contact      – kills when sprayed directly on the pest
//   ingestion    – kills when the pest eats treated tissue
//   translaminar – soaks through the leaf; reaches pests on the underside / in folds
//   xylem        – systemic, moves UP with water (to new leaves), not down
//   phloem       – systemic, moves both up and down with sap (reaches roots, new flush, hidden sap feeders)
//   physical     – smothers / dehydrates (oils, soaps) — no resistance possible
//   biological   – living organism (fungus, bacterium) infects the pest
//
// bee / resistance: 'high' | 'medium' | 'low'
// stages: which pest life stages it works on ('egg', 'young', 'adult')

export const MOA = {
  // ─── Insecticides / acaricides (IRAC) ───────────────────────────────────
  'IRAC 1A': {
    kind: 'insecticide',
    name: { en: 'Carbamates', zh: '氨基甲酸酯类' },
    how: { en: 'Blocks a nerve enzyme (acetylcholinesterase). Old, broad-spectrum chemistry.', zh: '抑制神经酶（乙酰胆碱酯酶）。老一代广谱化学药剂。' },
    route: ['contact', 'ingestion'], stages: ['young', 'adult'], bee: 'high', resistance: 'high',
    note: { en: 'Several members are highly hazardous to people. Kills natural enemies. Avoid.', zh: '多个品种对人体高毒。会杀死天敌。应避免使用。' },
  },
  'IRAC 1B': {
    kind: 'insecticide',
    name: { en: 'Organophosphates', zh: '有机磷类' },
    how: { en: 'Blocks a nerve enzyme (acetylcholinesterase). Old, broad-spectrum chemistry.', zh: '抑制神经酶（乙酰胆碱酯酶）。老一代广谱化学药剂。' },
    route: ['contact', 'ingestion'], stages: ['young', 'adult'], bee: 'high', resistance: 'high',
    note: { en: 'Most cheap "strong" insecticides belong here. Many are banned or being phased out worldwide; residues cause export rejections.', zh: '大多数便宜的“强力”杀虫剂属于此类。许多已在全球禁用或逐步淘汰；残留会导致出口被拒。' },
  },
  'IRAC 2A': {
    kind: 'insecticide',
    name: { en: 'Organochlorines (cyclodienes)', zh: '有机氯类（环戊二烯类）' },
    how: { en: 'Blocks nerve chloride channels. Extremely persistent in soil and body fat.', zh: '阻断神经氯离子通道。在土壤和人体脂肪中极难降解。' },
    route: ['contact', 'ingestion'], stages: ['young', 'adult'], bee: 'high', resistance: 'high',
    note: { en: 'Persistent Organic Pollutants — banned globally under the Stockholm Convention.', zh: '持久性有机污染物——已被《斯德哥尔摩公约》全球禁用。' },
  },
  'IRAC 2B': {
    kind: 'insecticide',
    name: { en: 'Fiproles (fipronil)', zh: '苯基吡唑类（氟虫腈）' },
    how: { en: 'Blocks nerve chloride channels. Slow-acting, so ants carry it back to the nest.', zh: '阻断神经氯离子通道。作用较慢，蚂蚁会带回巢穴传播。' },
    route: ['contact', 'ingestion'], stages: ['young', 'adult'], bee: 'high', resistance: 'medium',
    note: { en: 'Very toxic to bees and aquatic life. Use only as enclosed bait or soil treatment, never as an open canopy spray.', zh: '对蜜蜂和水生生物剧毒。只能作为封闭式饵剂或土壤处理使用，切勿喷洒树冠。' },
  },
  'IRAC 3A': {
    kind: 'insecticide',
    name: { en: 'Pyrethroids', zh: '拟除虫菊酯类' },
    how: { en: 'Keeps nerve sodium channels open — fast knockdown on contact.', zh: '使神经钠离子通道持续开放——接触后迅速击倒。' },
    route: ['contact', 'ingestion'], stages: ['young', 'adult'], bee: 'high', resistance: 'high',
    note: { en: 'Kills beneficial insects too, which often causes mite and scale outbreaks afterwards. Many sucking pests are already resistant.', zh: '同时杀死益虫，常导致之后螨类和介壳虫大爆发。许多刺吸式害虫已产生抗药性。' },
  },
  'IRAC 4A': {
    kind: 'insecticide',
    name: { en: 'Neonicotinoids', zh: '新烟碱类' },
    how: { en: 'Over-stimulates nerve receptors. Systemic — moves up in the plant with water.', zh: '过度刺激神经受体。内吸性——随水分在植物体内向上移动。' },
    route: ['contact', 'ingestion', 'xylem'], stages: ['young', 'adult'], bee: 'high', resistance: 'high',
    note: { en: 'Imidacloprid and thiamethoxam are highly toxic to bees and stingless bees (kelulut). Acetamiprid is lower risk. Never during flowering.', zh: '吡虫啉和噻虫嗪对蜜蜂及无刺蜂（kelulut）高毒。啶虫脒风险较低。开花期严禁使用。' },
  },
  'IRAC 4C': {
    kind: 'insecticide',
    name: { en: 'Sulfoximines (sulfoxaflor)', zh: '砜亚胺类（氟啶虫胺腈）' },
    how: { en: 'Acts on the same nerve receptor as neonicotinoids but in a different way; works on many neonic-resistant sap feeders.', zh: '作用于与新烟碱相同的神经受体，但方式不同；对许多抗新烟碱的刺吸害虫有效。' },
    route: ['contact', 'ingestion', 'xylem', 'translaminar'], stages: ['young', 'adult'], bee: 'medium', resistance: 'medium',
    note: { en: 'Toxic to bees when wet. Spray in the evening, outside flowering.', zh: '药液未干时对蜜蜂有毒。避开花期，傍晚喷施。' },
  },
  'IRAC 4D': {
    kind: 'insecticide',
    name: { en: 'Butenolides (flupyradifurone)', zh: '丁烯酸内酯类（氟吡呋喃酮）' },
    how: { en: 'Nerve receptor agonist, systemic. Lower bee toxicity than classic neonicotinoids.', zh: '神经受体激动剂，内吸性。对蜜蜂毒性低于传统新烟碱。' },
    route: ['contact', 'ingestion', 'xylem'], stages: ['young', 'adult'], bee: 'low', resistance: 'medium',
  },
  'IRAC 5': {
    kind: 'insecticide',
    name: { en: 'Spinosyns', zh: '多杀菌素类' },
    how: { en: 'Made from a soil bacterium. Over-excites nerves. Soaks into leaves.', zh: '源自土壤细菌发酵。过度兴奋神经。可渗入叶片。' },
    route: ['contact', 'ingestion', 'translaminar'], stages: ['young', 'adult'], bee: 'medium', resistance: 'medium',
    note: { en: 'Excellent on thrips and caterpillars, gentle on most predators. Toxic to bees only while wet — spray in the evening.', zh: '对蓟马和毛虫效果极佳，对大多数天敌较温和。仅在药液未干时对蜜蜂有毒——傍晚喷施。' },
  },
  'IRAC 6': {
    kind: 'insecticide',
    name: { en: 'Avermectins (abamectin, emamectin)', zh: '阿维菌素类（阿维菌素、甲氨基阿维菌素）' },
    how: { en: 'Paralyses nerves and muscles. Soaks into leaves, protecting the underside.', zh: '麻痹神经和肌肉。渗入叶片，保护叶背。' },
    route: ['contact', 'ingestion', 'translaminar'], stages: ['young', 'adult'], bee: 'medium', resistance: 'medium',
    note: { en: 'Breaks down fast in sunlight — spray late afternoon.', zh: '阳光下分解快——下午晚些时候喷施。' },
  },
  'IRAC 7C': {
    kind: 'insecticide',
    name: { en: 'Juvenile hormone mimic (pyriproxyfen)', zh: '保幼激素类似物（吡丙醚）' },
    how: { en: 'Fake growth hormone — eggs fail to hatch and nymphs cannot become adults.', zh: '假冒生长激素——使卵无法孵化、若虫无法发育为成虫。' },
    route: ['contact', 'translaminar'], stages: ['egg', 'young'], bee: 'low', resistance: 'medium',
    note: { en: 'Does not kill adults. Use early, when you first see young stages.', zh: '不杀成虫。应在初见幼期虫态时尽早使用。' },
  },
  'IRAC 9B': {
    kind: 'insecticide',
    name: { en: 'Feeding blockers (pymetrozine)', zh: '取食阻断剂（吡蚜酮）' },
    how: { en: 'Sap feeders stop feeding within hours and starve.', zh: '刺吸式害虫在数小时内停止取食并饿死。' },
    route: ['ingestion', 'xylem', 'translaminar'], stages: ['young', 'adult'], bee: 'low', resistance: 'low',
  },
  'IRAC 10': {
    kind: 'acaricide',
    name: { en: 'Mite growth inhibitors (hexythiazox, etoxazole)', zh: '螨类生长抑制剂（噻螨酮、乙螨唑）' },
    how: { en: 'Stops mite eggs and young mites from developing.', zh: '阻止螨卵和幼螨发育。' },
    route: ['contact', 'translaminar'], stages: ['egg', 'young'], bee: 'low', resistance: 'medium',
    note: { en: 'Slow but long-lasting. Pair with an adult-killing product if the population is already high.', zh: '起效慢但持效长。若虫口已高，需搭配杀成螨药剂。' },
  },
  'IRAC 11A': {
    kind: 'bio',
    name: { en: 'Bt (Bacillus thuringiensis)', zh: '苏云金杆菌（Bt）' },
    how: { en: 'A bacterial protein that destroys the gut of caterpillars after they eat it.', zh: '细菌蛋白，毛虫取食后破坏其肠道。' },
    route: ['ingestion'], stages: ['young'], bee: 'low', resistance: 'low',
    note: { en: 'Safe for people, bees and predators. Best on young caterpillars. Spray late afternoon (UV breaks it down).', zh: '对人、蜜蜂和天敌安全。对低龄幼虫最有效。下午晚些时候喷施（紫外线会分解）。' },
  },
  'IRAC 12A': {
    kind: 'acaricide',
    name: { en: 'Diafenthiuron', zh: '丁醚脲' },
    how: { en: 'Disrupts energy production in mites and whiteflies.', zh: '干扰螨类和粉虱的能量代谢。' },
    route: ['contact', 'ingestion'], stages: ['young', 'adult'], bee: 'high', resistance: 'medium',
  },
  'IRAC 12C': {
    kind: 'acaricide',
    name: { en: 'Propargite', zh: '炔螨特' },
    how: { en: 'Disrupts energy production in mites (contact action).', zh: '干扰螨类能量代谢（触杀）。' },
    route: ['contact'], stages: ['young', 'adult'], bee: 'low', resistance: 'medium',
    note: { en: 'Can burn young leaves in hot weather.', zh: '高温时可能灼伤嫩叶。' },
  },
  'IRAC 14': {
    kind: 'insecticide',
    name: { en: 'Nereistoxin analogues (cartap)', zh: '沙蚕毒素类（杀螟丹）' },
    how: { en: 'Blocks nerve receptors. Contact and stomach action.', zh: '阻断神经受体。触杀和胃毒作用。' },
    route: ['contact', 'ingestion', 'xylem'], stages: ['young', 'adult'], bee: 'high', resistance: 'medium',
  },
  'IRAC 15': {
    kind: 'insecticide',
    name: { en: 'Benzoylureas (lufenuron, novaluron…)', zh: '苯甲酰脲类（虱螨脲、氟酰脲等）' },
    how: { en: 'Larvae cannot build a new skin and die at the next moult.', zh: '幼虫无法形成新表皮，在下一次蜕皮时死亡。' },
    route: ['ingestion', 'contact'], stages: ['egg', 'young'], bee: 'low', resistance: 'medium',
    note: { en: 'Slow (3–5 days) but very selective. Does not kill adults.', zh: '起效慢（3–5天）但选择性极高。不杀成虫。' },
  },
  'IRAC 16': {
    kind: 'insecticide',
    name: { en: 'Buprofezin', zh: '噻嗪酮' },
    how: { en: 'Moulting disruptor specific to Hemiptera (whitefly, scale, mealybug, leafhopper nymphs).', zh: '专门针对半翅目（粉虱、介壳虫、粉蚧、叶蝉若虫）的蜕皮干扰剂。' },
    route: ['contact', 'ingestion'], stages: ['young'], bee: 'low', resistance: 'medium',
    note: { en: 'Kills crawlers and nymphs only — time it when crawlers are moving.', zh: '仅杀爬虫和若虫——在爬虫活动期施用。' },
  },
  'IRAC 22A': {
    kind: 'insecticide',
    name: { en: 'Indoxacarb', zh: '茚虫威' },
    how: { en: 'Blocks nerve sodium channels after the caterpillar eats it.', zh: '毛虫取食后阻断神经钠离子通道。' },
    route: ['ingestion', 'contact'], stages: ['young', 'adult'], bee: 'medium', resistance: 'medium',
  },
  'IRAC 23': {
    kind: 'insecticide',
    name: { en: 'Tetronic & tetramic acids (spirotetramat, spiromesifen)', zh: '季酮酸类（螺虫乙酯、螺甲螨酯）' },
    how: { en: 'Stops fat production so young stages cannot develop. Spirotetramat moves both UP and DOWN in the sap.', zh: '抑制脂肪合成，使幼期虫态无法发育。螺虫乙酯可在汁液中上下双向传导。' },
    route: ['ingestion', 'phloem', 'translaminar'], stages: ['egg', 'young'], bee: 'low', resistance: 'low',
    note: { en: 'Two-way systemic — reaches scales and mealybugs hidden under wax, in bark cracks and on roots. Slow: results show after 1–2 weeks.', zh: '双向内吸——可到达蜡壳下、树皮缝和根部的介壳虫与粉蚧。起效慢：1–2周后见效。' },
  },
  'IRAC 28': {
    kind: 'insecticide',
    name: { en: 'Diamides', zh: '双酰胺类' },
    how: { en: 'Locks the muscles of caterpillars and some beetles — they stop feeding within minutes.', zh: '锁定毛虫和部分甲虫的肌肉——数分钟内停止取食。' },
    route: ['ingestion', 'contact', 'translaminar'], stages: ['egg', 'young', 'adult'], bee: 'low', resistance: 'medium',
    note: { en: 'Long-lasting on the fruit surface, low toxicity to bees and people. Cyantraniliprole also controls thrips and sap feeders.', zh: '在果面持效长，对蜜蜂和人低毒。溴氰虫酰胺还可防治蓟马和刺吸害虫。' },
  },
  'IRAC 29': {
    kind: 'insecticide',
    name: { en: 'Flonicamid', zh: '氟啶虫酰胺' },
    how: { en: 'Sap feeders stop feeding and starve.', zh: '刺吸式害虫停止取食并饿死。' },
    route: ['ingestion', 'xylem', 'translaminar'], stages: ['young', 'adult'], bee: 'low', resistance: 'low',
  },
  'IRAC UN': {
    kind: 'physical',
    name: { en: 'Oils, soaps & botanicals', zh: '矿物油、皂液与植物源药剂' },
    how: { en: 'Smothers or dehydrates soft-bodied pests (mineral oil, insecticidal soap); neem repels and disrupts growth.', zh: '窒息或脱水软体害虫（矿物油、杀虫皂）；印楝素驱避并干扰生长。' },
    route: ['contact', 'physical'], stages: ['egg', 'young', 'adult'], bee: 'low', resistance: 'low',
    note: { en: 'No resistance can develop. Needs full coverage. Do not spray oil in hot midday sun or mixed with sulfur.', zh: '不会产生抗药性。需要全面覆盖。避免在正午高温喷油，勿与硫磺混用。' },
  },
  'BIO-INS': {
    kind: 'bio',
    name: { en: 'Insect-killing fungi (Beauveria, Metarhizium, Isaria, Lecanicillium)', zh: '昆虫病原真菌（白僵菌、绿僵菌、棒束孢、蜡蚧轮枝菌）' },
    how: { en: 'Fungal spores land on the insect, grow through its skin and kill it from inside.', zh: '真菌孢子附着在虫体表面，穿透表皮并从内部杀死害虫。' },
    route: ['contact', 'biological'], stages: ['young', 'adult'], bee: 'low', resistance: 'low',
    note: { en: 'Needs humidity — spray in the evening. Do not tank-mix with fungicides.', zh: '需要湿度——傍晚喷施。切勿与杀菌剂混用。' },
  },
  'BIO-NEM': {
    kind: 'bio',
    name: { en: 'Beneficial nematodes', zh: '昆虫病原线虫' },
    how: { en: 'Microscopic worms that hunt borer larvae and grubs inside tunnels and soil.', zh: '能在虫道和土壤中主动寻找钻蛀幼虫和蛴螬的微小线虫。' },
    route: ['biological'], stages: ['young'], bee: 'low', resistance: 'low',
  },
  'SULFUR': {
    kind: 'acaricide',
    name: { en: 'Sulfur', zh: '硫磺' },
    how: { en: 'Multi-site contact action against mites and some fungi.', zh: '多作用位点触杀，防治螨类及部分真菌。' },
    route: ['contact'], stages: ['young', 'adult'], bee: 'low', resistance: 'low',
    note: { en: 'Do not use within 2 weeks of an oil spray (leaf burn).', zh: '喷油前后2周内勿用（会烧叶）。' },
  },

  // ─── Fungicides (FRAC) ─────────────────────────────────────────────────
  'FRAC 1': {
    kind: 'fungicide',
    name: { en: 'Benzimidazoles (carbendazim, benomyl)', zh: '苯并咪唑类（多菌灵、苯菌灵）' },
    how: { en: 'Stops fungal cell division. Systemic, single-site.', zh: '阻止真菌细胞分裂。内吸性，单一作用位点。' },
    route: ['xylem'], stages: [], bee: 'low', resistance: 'high',
    note: { en: 'Fungi become resistant very quickly. No effect on Phytophthora/Pythium. Carbendazim is not approved in the EU — check export residue limits.', zh: '真菌极易产生抗性。对疫霉/腐霉无效。多菌灵在欧盟未获批准——注意出口残留限量。' },
  },
  'FRAC 3': {
    kind: 'fungicide',
    name: { en: 'Triazoles / DMI (hexaconazole, difenoconazole…)', zh: '三唑类 / DMI（己唑醇、苯醚甲环唑等）' },
    how: { en: 'Blocks building of the fungal cell membrane. Systemic, curative.', zh: '阻断真菌细胞膜合成。内吸性，有治疗作用。' },
    route: ['xylem', 'translaminar'], stages: [], bee: 'low', resistance: 'medium',
    note: { en: 'Works on true fungi only — NOT on Phytophthora or Pythium.', zh: '仅对真正的真菌有效——对疫霉和腐霉无效。' },
  },
  'FRAC 4': {
    kind: 'fungicide',
    name: { en: 'Phenylamides (metalaxyl-M)', zh: '苯基酰胺类（精甲霜灵）' },
    how: { en: 'Stops Phytophthora/Pythium from making RNA. Strongly systemic.', zh: '阻止疫霉/腐霉合成RNA。强内吸性。' },
    route: ['xylem', 'phloem'], stages: [], bee: 'low', resistance: 'high',
    note: { en: 'Resistance develops fast — max 2 uses per season, always rotate or mix with a multi-site product.', zh: '易产生抗性——每季最多2次，务必轮换或与多位点药剂混用。' },
  },
  'FRAC 11': {
    kind: 'fungicide',
    name: { en: 'Strobilurins / QoI (azoxystrobin)', zh: '甲氧基丙烯酸酯类 / QoI（嘧菌酯）' },
    how: { en: 'Blocks fungal energy production. Preventive, partly systemic.', zh: '阻断真菌能量代谢。保护性，部分内吸。' },
    route: ['translaminar', 'xylem'], stages: [], bee: 'low', resistance: 'high',
    note: { en: 'High resistance risk — never more than 2 sprays in a row.', zh: '抗性风险高——连续使用不超过2次。' },
  },
  'FRAC 20': {
    kind: 'fungicide',
    name: { en: 'Pencycuron', zh: '戊菌隆' },
    how: { en: 'Specific to Rhizoctonia.', zh: '专门防治丝核菌。' },
    route: ['contact'], stages: [], bee: 'low', resistance: 'low',
  },
  'FRAC 21': {
    kind: 'fungicide',
    name: { en: 'Cyazofamid', zh: '氰霜唑' },
    how: { en: 'Blocks energy production in oomycetes (Phytophthora/Pythium). Preventive.', zh: '阻断卵菌（疫霉/腐霉）能量代谢。保护性。' },
    route: ['contact', 'translaminar'], stages: [], bee: 'low', resistance: 'medium',
  },
  'FRAC 40': {
    kind: 'fungicide',
    name: { en: 'CAA (dimethomorph, mandipropamid)', zh: '羧酸酰胺类（烯酰吗啉、双炔酰菌胺）' },
    how: { en: 'Stops the oomycete cell wall from forming.', zh: '阻止卵菌细胞壁形成。' },
    route: ['translaminar', 'xylem'], stages: [], bee: 'low', resistance: 'medium',
  },
  'FRAC P07': {
    kind: 'fungicide',
    name: { en: 'Phosphonates (phosphorous acid, fosetyl-Al)', zh: '亚磷酸盐类（亚磷酸、三乙膦酸铝）' },
    how: { en: 'Moves UP and DOWN in the tree and switches on the tree\'s own defences against Phytophthora.', zh: '在树体内上下传导，并激活树体自身对疫霉的防御。' },
    route: ['xylem', 'phloem'], stages: [], bee: 'low', resistance: 'low',
    note: { en: 'The standard Phytophthora tool in durian: trunk injection or foliar spray. Do not overdose — leaf burn.', zh: '榴莲防治疫霉的标准工具：树干注射或叶面喷施。勿过量——会烧叶。' },
  },
  'FRAC M01': {
    kind: 'fungicide',
    name: { en: 'Copper (hydroxide, oxychloride, Bordeaux)', zh: '铜制剂（氢氧化铜、氧氯化铜、波尔多液）' },
    how: { en: 'Multi-site protectant. Kills spores, bacteria and algae on the surface.', zh: '多位点保护剂。杀灭表面的孢子、细菌和藻类。' },
    route: ['contact'], stages: [], bee: 'low', resistance: 'low',
    note: { en: 'The main option against bacterial diseases and algae. Protective only — cannot cure infections already inside.', zh: '防治细菌病害和藻类的主要选择。仅有保护作用——无法治愈已侵入的病害。' },
  },
  'FRAC M03': {
    kind: 'fungicide',
    name: { en: 'Dithiocarbamates (mancozeb, propineb)', zh: '二硫代氨基甲酸酯类（代森锰锌、丙森锌）' },
    how: { en: 'Multi-site protectant — fungi almost never become resistant.', zh: '多位点保护剂——真菌几乎不会产生抗性。' },
    route: ['contact'], stages: [], bee: 'low', resistance: 'low',
    note: { en: 'Washes off in rain; re-apply after heavy rain. Ideal rotation/mix partner.', zh: '易被雨水冲刷；大雨后需补喷。理想的轮换/混配伙伴。' },
  },
  'BIO-FUN': {
    kind: 'bio',
    name: { en: 'Biological fungicides (Trichoderma, Bacillus)', zh: '生物杀菌剂（木霉菌、芽孢杆菌）' },
    how: { en: 'Beneficial microbes that out-compete and attack disease fungi in soil and on roots.', zh: '有益微生物，在土壤和根部竞争并攻击病原菌。' },
    route: ['biological'], stages: [], bee: 'low', resistance: 'low',
    note: { en: 'Preventive. Apply with compost/organic matter. Do not mix with chemical fungicides.', zh: '预防性。配合堆肥/有机质施用。勿与化学杀菌剂混用。' },
  },

  // ─── Others ────────────────────────────────────────────────────────────
  'MOLL': {
    kind: 'molluscicide',
    name: { en: 'Snail baits', zh: '杀螺饵剂' },
    how: { en: 'Baits eaten by snails and slugs.', zh: '被蜗牛和蛞蝓取食的饵剂。' },
    route: ['ingestion'], stages: ['young', 'adult'], bee: 'low', resistance: 'low',
  },
  'HRAC 22': {
    kind: 'herbicide',
    name: { en: 'Bipyridyliums (paraquat)', zh: '联吡啶类（百草枯）' },
    how: { en: 'Burns green tissue on contact.', zh: '接触后灼烧绿色组织。' },
    route: ['contact'], stages: [], bee: 'low', resistance: 'low',
  },
  'HRAC 10': {
    kind: 'herbicide',
    name: { en: 'Glufosinate', zh: '草铵膦' },
    how: { en: 'Contact herbicide that stops weeds processing nitrogen.', zh: '触杀型除草剂，阻止杂草代谢氮。' },
    route: ['contact'], stages: [], bee: 'low', resistance: 'low',
  },
};

export const ROUTE_LABEL = {
  contact: { en: 'Contact', zh: '触杀' },
  ingestion: { en: 'Stomach', zh: '胃毒' },
  translaminar: { en: 'Soaks into leaf', zh: '渗透叶片' },
  xylem: { en: 'Systemic ↑', zh: '内吸 ↑' },
  phloem: { en: 'Systemic ↑↓', zh: '双向内吸 ↑↓' },
  physical: { en: 'Physical', zh: '物理作用' },
  biological: { en: 'Living agent', zh: '生物活体' },
};

export const STAGE_LABEL = {
  egg: { en: 'eggs', zh: '卵' },
  young: { en: 'young stages', zh: '幼期' },
  adult: { en: 'adults', zh: '成虫' },
};
