import React, { useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Card, Chip, Section, Icon, Badge } from '../ui/kit.jsx';
import { GroupArt } from '../components/Art.jsx';
import { GROUPS, KINGDOM } from '../core/groups.js';
import { STAGES, WEATHER } from '../core/stages.js';
import { LESSONS } from '../core/lessons.js';
import { searchKnownPests } from '../core/examples.js';
import { href } from '../hooks/useRoute.js';

export function GroupRow({ g, right }) {
  const { t } = useLang();
  return (
    <a href={href(`group/${g.id}`)} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200 active:bg-stone-50">
      <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
        <GroupArt id={g.id} className="w-9 h-9" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-extrabold text-[16px] text-stone-900 leading-tight">{t(g.name)}</div>
        <div className="text-[14px] text-stone-600 leading-snug line-clamp-2">{t(g.examples)}</div>
      </div>
      {right}
      <Icon name="chevron" className="w-5 h-5 text-stone-400 shrink-0" />
    </a>
  );
}

export default function Home({ orchard, setOrchard }) {
  const { t, ui } = useLang();
  const [q, setQ] = useState('');
  const hits = useMemo(() => searchKnownPests(q).slice(0, 8), [q]);

  const watch = useMemo(() => {
    if (!orchard.stage) return [];
    return GROUPS
      .filter(g => g.stages.includes(orchard.stage))
      .map(g => ({ g, w: orchard.weather && g.weather === orchard.weather ? 2 : g.weather && orchard.weather ? 0 : 1 }))
      .sort((a, b) => b.w - a.w)
      .slice(0, 6);
  }, [orchard.stage, orchard.weather]);

  return (
    <div>
      {/* Primary actions */}
      <a href={href('diagnose')} className="block rounded-2xl bg-emerald-700 text-white p-5 shadow-md active:bg-emerald-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center"><Icon name="search" className="w-7 h-7" /></div>
          <div className="flex-1">
            <div className="text-xl font-extrabold leading-tight">{ui('home.cta')}</div>
            <div className="text-[15px] text-emerald-50 leading-snug mt-1">{ui('home.ctaSub')}</div>
          </div>
        </div>
      </a>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <a href={href('chem')} className="rounded-2xl bg-white border-2 border-stone-200 p-4 active:bg-stone-50">
          <Icon name="flask" className="w-7 h-7 text-emerald-700" />
          <div className="font-extrabold text-[16px] mt-2 leading-tight">{ui('home.checkChem')}</div>
          <div className="text-[14px] text-stone-600 leading-snug mt-0.5">{ui('home.checkChemSub')}</div>
        </a>
        <a href={href('rotate')} className="rounded-2xl bg-white border-2 border-stone-200 p-4 active:bg-stone-50">
          <Icon name="rotate" className="w-7 h-7 text-emerald-700" />
          <div className="font-extrabold text-[16px] mt-2 leading-tight">{ui('home.rotate')}</div>
          <div className="text-[14px] text-stone-600 leading-snug mt-0.5">{ui('home.rotateSub')}</div>
        </a>
      </div>

      {/* Orchard context */}
      <Section title={ui('home.myOrchard')}>
        <Card className="p-4">
          <div className="text-[14px] font-bold text-stone-500 uppercase tracking-wide">{ui('home.stage')}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {STAGES.map(s => (
              <Chip key={s.id} on={orchard.stage === s.id} onClick={() => setOrchard({ stage: orchard.stage === s.id ? null : s.id })}>
                <div className="leading-tight">{t(s.name)}</div>
                <div className={`text-[12px] font-semibold ${orchard.stage === s.id ? 'text-emerald-100' : 'text-stone-500'}`}>{t(s.hint)}</div>
              </Chip>
            ))}
          </div>
          <div className="text-[14px] font-bold text-stone-500 uppercase tracking-wide mt-4">{ui('home.weather')}</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {WEATHER.map(w => (
              <Chip key={w.id} on={orchard.weather === w.id} onClick={() => setOrchard({ weather: orchard.weather === w.id ? null : w.id })}>
                <span className="inline-flex items-center gap-2"><Icon name={w.id === 'wet' ? 'drop' : 'sun'} />{t(w.name)}</span>
              </Chip>
            ))}
          </div>
        </Card>
      </Section>

      <Section title={ui('home.watch')} sub={orchard.stage ? ui('home.watchSub') : ui('home.pickStage')}>
        <div className="space-y-2">
          {watch.map(({ g, w }) => (
            <GroupRow key={g.id} g={g} right={w === 2 ? <Badge tone="amber">{ui('home.weatherRisk')}</Badge> : null} />
          ))}
        </div>
        {orchard.stage === 'flowering' && (
          <div className="mt-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-3 text-[15px] text-amber-900 flex gap-2">
            <Icon name="bee" className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{ui('home.flowerWarn')}</span>
          </div>
        )}
      </Section>

      {/* Known pest search */}
      <Section title={ui('home.knownTitle')} sub={ui('home.knownSub')}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={ui('home.searchKnown')}
          className="w-full min-h-[48px] rounded-xl border-2 border-stone-300 px-3 bg-white focus:border-emerald-600 outline-none" />
        {q && (
          <div className="mt-2 space-y-1.5">
            {hits.length === 0 && <p className="text-[15px] text-stone-600">{ui('home.noKnown')}</p>}
            {hits.map(({ pest, groupId }) => (
              <a key={pest.id} href={href(`group/${groupId}`)} className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white border border-stone-200">
                <div className="min-w-0">
                  <div className="font-bold text-[16px] leading-tight">{t(pest.common)}</div>
                  <div className="text-[13px] italic text-stone-500 truncate">{pest.scientific}</div>
                </div>
                <Badge tone="green">{t(GROUPS.find(g => g.id === groupId)?.name)}</Badge>
              </a>
            ))}
          </div>
        )}
      </Section>

      {/* All groups, by kingdom */}
      <Section title={ui('home.allGroups')} sub={ui('home.allGroupsSub')}>
        {Object.keys(KINGDOM).map(k => (
          <div key={k} className="mb-4">
            <div className="text-[14px] font-extrabold text-stone-500 uppercase tracking-wide mb-2">{t(KINGDOM[k])}</div>
            <div className="space-y-2">{GROUPS.filter(g => g.kingdom === k).map(g => <GroupRow key={g.id} g={g} />)}</div>
          </div>
        ))}
      </Section>

      <Section title={ui('home.learnMore')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LESSONS.slice(0, 4).map(l => (
            <a key={l.id} href={href(`learn/${l.id}`)} className="p-3 rounded-xl bg-white border border-stone-200 active:bg-stone-50">
              <div className="font-extrabold text-[16px] leading-tight">{t(l.title)}</div>
              <div className="text-[14px] text-stone-600 leading-snug mt-0.5">{t(l.summary)}</div>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
