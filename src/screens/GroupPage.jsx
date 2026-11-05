import React, { Suspense, lazy, useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Card, Section, Icon, Badge, Callout, BackBar, Bullets, Chip } from '../ui/kit.jsx';
import { GroupArt } from '../components/Art.jsx';
import { groupById, FEEDING } from '../core/groups.js';
import { ROUTE_LABEL } from '../core/moa.js';
import { recommend } from '../core/recommend.js';
import { CHART_FOR_GROUP } from '../core/rotation.js';
import { examplesFor } from '../core/examples.js';
import { stageById } from '../core/stages.js';
import { href } from '../hooks/useRoute.js';

const WikiPhotoStrip = lazy(() => import('../components/WikiPhotoStrip.jsx').then(m => ({ default: m.WikiPhotoStrip })));

const FIT_TONE = { best: 'green', good: 'blue', limited: 'grey' };
const WARN_TONE = { beeBlock: 'red', beeHigh: 'amber', beeEvening: 'amber', phi: 'violet', resistance: 'grey', rotate: 'red', crossRes: 'amber' };
const TOX_TONE = { Ia: 'red', Ib: 'red', II: 'amber', III: 'grey', U: 'green', NL: 'grey' };

export const moaCode = (info) => (info.irac ? `IRAC ${info.irac}` : info.key.startsWith('FRAC') ? info.key : null);

export function ChemChip({ c }) {
  const { t } = useLang();
  return (
    <a href={href(`chem/${c.id}`)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-[14px] font-bold active:bg-stone-100">
      <span>{t(c.name)}</span>
      {c.bee === 'high' && <Icon name="bee" className="w-4 h-4 text-rose-600" />}
      {(c.tox === 'Ia' || c.tox === 'Ib') && <span className="text-rose-700 text-[12px]">WHO {c.tox}</span>}
    </a>
  );
}

export default function GroupPage({ id, orchard, setOrchard }) {
  const { t, ui, lang } = useLang();
  const g = groupById(id);
  const [showEx, setShowEx] = useState(false);
  const [lastPick, setLastPick] = useState(false);

  const rec = useMemo(() => g && recommend(g, { stage: orchard.stage, recentMoa: orchard.recentMoa }), [g, orchard.stage, orchard.recentMoa]);
  if (!g) return <div><BackBar /><p>Not found.</p></div>;

  const examples = examplesFor(g.id);
  const stage = orchard.stage && stageById(orchard.stage);
  const chart = CHART_FOR_GROUP[g.id];
  const setLast = (key) => setOrchard({ recentMoa: key ? [key] : [] });

  const share = () => {
    const lines = [
      `AgriPro IPM — ${t(g.name)}`, t(g.examples), '', t(g.why), '',
      `${ui('group.nonChem')}:`, ...g.nonChem.map(n => `• ${t(n)}`),
    ];
    if (rec.rotation.length) {
      lines.push('', `${ui('group.rotation')}:`);
      rec.rotation.forEach((o, i) => lines.push(`${i + 1}. ${t(o.moaInfo.name)}${moaCode(o.moaInfo) ? ` (${moaCode(o.moaInfo)})` : ''} — ${o.actives.slice(0, 3).map(a => t(a.name)).join(', ')}`));
    }
    lines.push('', ui('common.disclaimer'));
    const url = `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div>
      <BackBar />
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
          <GroupArt id={g.id} className="w-14 h-14" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold leading-tight">{t(g.name)}</h1>
          <p className="text-[15px] text-stone-600 leading-snug">{t(g.examples)}</p>
        </div>
      </div>

      <Card className="mt-4 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Fact label={ui('group.feeds')} value={t(FEEDING[g.feeding])} />
        <Fact label={ui('group.hides')} value={t(g.hides)} />
        <Fact label={ui('group.stage')} value={t(g.damagingStage)} />
        <Fact label={ui('group.taxon')} value={t(g.taxon)} />
      </Card>

      <Section title={ui('group.why')}>
        <p className="text-[16px] leading-relaxed text-stone-800">{t(g.why)}</p>
      </Section>

      <Section title={ui('group.scout')}>
        <Card className="p-4">
          <p className="text-[16px] leading-snug">{t(g.scout)}</p>
          <div className="mt-3 text-[14px] font-bold text-stone-500">{ui('group.threshold')}</div>
          <p className="text-[16px] leading-snug font-semibold">{t(g.threshold)}</p>
        </Card>
      </Section>

      <Section title={ui('group.nonChem')}>
        <Card className="p-4"><Bullets items={g.nonChem} t={t} /></Card>
      </Section>

      {g.chem.length === 0 ? (
        <Section><Callout tone="blue" icon="leaf">{ui('group.noChem')}</Callout></Section>
      ) : (
        <>
          <Section title={ui('group.chem')} sub={ui('group.chemSub')}>
            {stage && <div className="mb-3"><Badge tone="green">{ui('home.stage')}: {t(stage.name)}</Badge></div>}

            {/* Last-used picker → rotation-aware ranking */}
            <Card className="p-3 mb-3">
              <button className="w-full flex items-center justify-between min-h-[40px] text-left" onClick={() => setLastPick(!lastPick)}>
                <span className="font-bold text-[15px]">{ui('group.lastUsed')}</span>
                <Badge tone={orchard.recentMoa.length ? 'amber' : 'grey'}>
                  {orchard.recentMoa.length ? orchard.recentMoa[0] : ui('group.lastUsedNone')}
                </Badge>
              </button>
              {lastPick && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <Chip on={!orchard.recentMoa.length} onClick={() => { setLast(null); setLastPick(false); }}>{ui('group.lastUsedNone')}</Chip>
                  {g.chem.map(c => (
                    <Chip key={c.moa} on={orchard.recentMoa.includes(c.moa)} onClick={() => { setLast(c.moa); setLastPick(false); }}>
                      {moaCode(rec.options.find(o => o.moa === c.moa).moaInfo) || t(rec.options.find(o => o.moa === c.moa).moaInfo.name)}
                    </Chip>
                  ))}
                </div>
              )}
            </Card>

            <div className="space-y-3">
              {rec.options.map(o => <OptionCard key={o.moa} o={o} />)}
            </div>
          </Section>

          {rec.rotation.length > 1 && (
            <Section title={ui('group.rotation')} sub={ui('group.rotationSub')}>
              <ol className="space-y-2">
                {rec.rotation.map((o, i) => (
                  <li key={o.moa} className="flex gap-3 items-start p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="w-8 h-8 rounded-full bg-emerald-700 text-white font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div>
                      <div className="font-extrabold text-[16px]">{t(o.moaInfo.name)} {moaCode(o.moaInfo) && <span className="text-emerald-800">· {moaCode(o.moaInfo)}</span>}</div>
                      <div className="text-[14px] text-stone-700">{o.actives.slice(0, 4).map(a => t(a.name)).join(' · ')}</div>
                    </div>
                  </li>
                ))}
              </ol>
              {chart && (
                <a href={href(`rotate/${chart[0]}`)} className="mt-3 flex items-center justify-between gap-2 p-3 rounded-xl bg-white border-2 border-emerald-600 font-bold text-emerald-900">
                  <span><Icon name="rotate" className="w-5 h-5 inline -mt-1 mr-1" />{ui('group.fullRotation')}</span>
                  <Icon name="chevron" className="w-5 h-5" />
                </a>
              )}
            </Section>
          )}
        </>
      )}

      {rec.avoid.length > 0 && (
        <Section title={ui('group.avoid')}>
          <div className="space-y-2">
            {rec.avoid.map(a => (
              <div key={a.moa} className="flex gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200">
                <Icon name="x" className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" strokeWidth={3} />
                <div>
                  <div className="font-extrabold text-[15px] text-rose-900">{t(a.moaInfo.name)} {moaCode(a.moaInfo) && `· ${moaCode(a.moaInfo)}`}</div>
                  <div className="text-[15px] text-rose-900 leading-snug">{t(a.why)}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {examples.length > 0 && (
        <Section title={ui('group.examples')}>
          <button onClick={() => setShowEx(!showEx)} className="w-full min-h-[48px] rounded-xl border-2 border-stone-300 bg-white font-bold">
            {showEx ? '▲' : '▼'} {examples.length} · {ui('group.examples')}
          </button>
          {showEx && (
            <div className="space-y-3 mt-3">
              {examples.map(p => (
                <Card key={p.id} className="p-3">
                  <div className="font-extrabold text-[16px]">{t(p.common)}</div>
                  <div className="text-[13px] italic text-stone-500">{p.scientific}</div>
                  <p className="text-[15px] mt-1 leading-snug">{t(p.symptoms)}</p>
                  {p.category !== 'Verteater' && (
                    <Suspense fallback={null}><WikiPhotoStrip scientificName={p.scientific} lang={lang} /></Suspense>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Section>
      )}

      <button onClick={share} className="mt-6 w-full min-h-[52px] rounded-xl bg-[#25D366] text-white font-extrabold flex items-center justify-center gap-2">
        <Icon name="share" /> {ui('group.share')}
      </button>
      <p className="mt-4 text-[13px] text-stone-500 leading-snug">{ui('common.disclaimer')}</p>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <div className="text-[13px] font-bold text-stone-500 uppercase tracking-wide">{label}</div>
      <div className="text-[16px] font-semibold leading-snug">{value}</div>
    </div>
  );
}

function OptionCard({ o }) {
  const { t, ui } = useLang();
  const info = o.moaInfo;
  const blocked = o.warnings.includes('beeBlock');
  return (
    <Card className={`p-4 ${blocked ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-extrabold text-[17px] leading-tight">{t(info.name)}</div>
          {moaCode(info) && <div className="text-[14px] font-bold text-emerald-800">{moaCode(info)}</div>}
        </div>
        <Badge tone={FIT_TONE[o.fit]}>{ui(`fit.${o.fit}`)}</Badge>
      </div>
      <p className="text-[15px] leading-snug mt-2 text-stone-800">{t(o.why)}</p>
      {info.route.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {info.route.map(r => <Badge key={r} tone="blue">{t(ROUTE_LABEL[r])}</Badge>)}
        </div>
      )}
      {o.warnings.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {o.warnings.map(w => <Badge key={w} tone={WARN_TONE[w]}>{ui(`warn.${w}`)}</Badge>)}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {o.actives.map(c => <ChemChip key={c.id} c={c} />)}
      </div>
    </Card>
  );
}

export { TOX_TONE };
