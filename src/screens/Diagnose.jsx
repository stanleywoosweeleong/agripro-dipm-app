import React, { useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Card, Chip, Icon, Badge, Callout } from '../ui/kit.jsx';
import { GroupArt } from '../components/Art.jsx';
import { PARTS, CULPRITS, signsForPart, diagnose } from '../core/diagnosis.js';
import { recommend } from '../core/recommend.js';
import { ChemChip, moaCode } from './GroupPage.jsx';
import { href } from '../hooks/useRoute.js';

const toggle = (arr, v) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

export default function Diagnose({ orchard }) {
  const { t, ui } = useLang();
  const [step, setStep] = useState(0);
  const [parts, setParts] = useState([]);
  const [signs, setSigns] = useState([]);
  const [culprits, setCulprits] = useState([]);

  const signOptions = useMemo(() => signsForPart(parts), [parts]);
  const results = useMemo(
    () => (step === 3 ? diagnose({ signs, culprits, weather: orchard.weather }) : []),
    [step, signs, culprits, orchard.weather]
  );

  const restart = () => { setStep(0); setParts([]); setSigns([]); setCulprits([]); };
  const canNext = [parts.length > 0, signs.length > 0, culprits.length > 0][step];

  const Progress = () => (
    <div className="flex gap-1.5 mb-4" aria-hidden="true">
      {[0, 1, 2].map(i => <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-emerald-600' : 'bg-stone-200'}`} />)}
    </div>
  );

  const Nav = () => (
    <div className="sticky bottom-[76px] mt-5 flex gap-2 bg-stone-50/95 py-2">
      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="min-h-[52px] px-5 rounded-xl border-2 border-stone-300 bg-white font-bold">{ui('diag.back')}</button>
      )}
      <button disabled={!canNext} onClick={() => setStep(step + 1)}
        className="flex-1 min-h-[52px] rounded-xl bg-emerald-700 text-white font-extrabold text-[17px] disabled:bg-stone-300 disabled:text-stone-500">
        {step === 2 ? ui('diag.results') : ui('diag.next')}
      </button>
    </div>
  );

  if (step === 3) {
    const [top, ...rest] = results;
    return (
      <div>
        <h1 className="text-2xl font-extrabold">{ui('diag.resultTitle')}</h1>
        {!top && <p className="mt-3 text-[16px]">{ui('diag.none')}</p>}
        {top && (
          <>
            {top.confidence === 'low' && <div className="mt-3"><Callout>{ui('diag.lowConf')}</Callout></div>}
            <ResultCard r={top} big orchard={orchard} />
            {rest.length > 0 && (
              <>
                <h2 className="mt-6 text-lg font-extrabold">{ui('diag.others')}</h2>
                <div className="space-y-2 mt-2">{rest.slice(0, 3).map(r => <ResultCard key={r.group.id} r={r} />)}</div>
              </>
            )}
          </>
        )}
        <button onClick={restart} className="mt-6 w-full min-h-[52px] rounded-xl border-2 border-stone-300 bg-white font-bold">{ui('diag.restart')}</button>
      </div>
    );
  }

  return (
    <div>
      <Progress />
      {step === 0 && (
        <>
          <h1 className="text-2xl font-extrabold">{ui('diag.q1')}</h1>
          <p className="text-[15px] text-stone-600">{ui('diag.q1Sub')}</p>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {PARTS.map(p => (
              <Chip key={p.id} on={parts.includes(p.id)} onClick={() => { setParts(toggle(parts, p.id)); setSigns([]); }} className="text-[17px] py-3">
                {t(p.name)}
              </Chip>
            ))}
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <h1 className="text-2xl font-extrabold">{ui('diag.q2')}</h1>
          <p className="text-[15px] text-stone-600">{ui('diag.q2Sub')}</p>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {signOptions.map(s => (
              <Chip key={s.id} on={signs.includes(s.id)} onClick={() => setSigns(toggle(signs, s.id))}>
                <span className="inline-flex gap-2 items-start">
                  <span className={`mt-0.5 w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${signs.includes(s.id) ? 'border-white' : 'border-stone-400'}`}>
                    {signs.includes(s.id) && <Icon name="check" className="w-4 h-4" strokeWidth={3} />}
                  </span>
                  {t(s.label)}
                </span>
              </Chip>
            ))}
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="text-2xl font-extrabold">{ui('diag.q3')}</h1>
          <p className="text-[15px] text-stone-600">{ui('diag.q3Sub')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {CULPRITS.map(c => (
              <Chip key={c.id} on={culprits.includes(c.id)}
                onClick={() => setCulprits(c.id === 'nothing' || c.id === 'unsure' ? [c.id] : toggle(culprits.filter(x => x !== 'nothing' && x !== 'unsure'), c.id))}>
                {t(c.label)}
              </Chip>
            ))}
          </div>
        </>
      )}
      <Nav />
    </div>
  );
}

function ResultCard({ r, big, orchard }) {
  const { t, ui } = useLang();
  const g = r.group;
  const tone = r.confidence === 'high' ? 'green' : r.confidence === 'medium' ? 'amber' : 'grey';
  const uniq = [...new Map(r.evidence.map(e => [e.id, e])).values()];
  return (
    <Card className={`${big ? 'mt-3 p-4 border-2 border-emerald-600' : 'p-3'}`}>
      <div className="flex items-center gap-3">
        <div className={`${big ? 'w-16 h-16' : 'w-12 h-12'} rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0`}>
          <GroupArt id={g.id} className={big ? 'w-12 h-12' : 'w-9 h-9'} />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`${big ? 'text-xl' : 'text-[17px]'} font-extrabold leading-tight`}>{t(g.name)}</div>
          <div className="text-[14px] text-stone-600 leading-snug">{t(g.examples)}</div>
          <div className="mt-1"><Badge tone={tone}>{ui(`diag.conf.${r.confidence}`)}</Badge></div>
        </div>
      </div>
      {big && (
        <>
          <div className="mt-3 text-[14px] font-bold text-stone-500">{ui('diag.because')}</div>
          <div className="flex flex-wrap gap-1.5 mt-1">{uniq.map(e => <Badge key={e.id}>{t(e.label)}</Badge>)}</div>
          <p className="mt-3 text-[16px] leading-snug text-stone-800">{t(g.why)}</p>
          <WhatWorks g={g} orchard={orchard} />
        </>
      )}
      <a href={href(`group/${g.id}`)} className={`mt-3 flex items-center justify-center gap-1 min-h-[48px] rounded-xl font-extrabold ${big ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-900'}`}>
        {ui('diag.open')} <Icon name="chevron" className="w-5 h-5" />
      </a>
    </Card>
  );
}

// "Spotted something → what works": the effective options, straight on the result.
function WhatWorks({ g, orchard }) {
  const { t, ui } = useLang();
  const ctx = { stage: orchard?.stage, recentMoa: orchard?.recentMoa || [] };
  const org = recommend(g, { ...ctx, track: 'organic' }).options.filter(o => !o.warnings.includes('beeBlock')).slice(0, 3);
  const conv = recommend(g, { ...ctx, track: 'conventional' }).options.filter(o => !o.warnings.includes('beeBlock')).slice(0, 3);
  const Block = ({ title, tone, list }) => list.length > 0 && (
    <div className={`mt-3 rounded-xl border p-3 ${tone}`}>
      <div className="font-extrabold text-[15px] mb-2">{title}</div>
      <div className="space-y-2.5">
        {list.map(o => (
          <div key={o.moa}>
            <div className="text-[15px] font-bold leading-tight">{t(o.moaInfo.name)}{moaCode(o.moaInfo) ? <span className="text-emerald-800"> · {moaCode(o.moaInfo)}</span> : null}</div>
            <div className="flex flex-wrap gap-1.5 mt-1">{o.actives.slice(0, 3).map(c => <ChemChip key={c.id} c={c} />)}</div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="mt-4">
      <div className="text-lg font-extrabold">{ui('diag.whatWorks')}</div>
      <div className="mt-2 rounded-xl border border-stone-200 bg-stone-50 p-3">
        <div className="font-extrabold text-[15px] mb-1">{ui('group.nonChem')}</div>
        <ul className="space-y-1">{g.nonChem.slice(0, 2).map((n, i) => <li key={i} className="text-[15px] leading-snug">• {t(n)}</li>)}</ul>
      </div>
      <Block title={ui('group.trackOrganic')} tone="bg-lime-50 border-lime-300" list={org} />
      <Block title={ui('group.trackConv')} tone="bg-white border-stone-300" list={conv} />
      {!org.length && !conv.length && <p className="mt-2 text-[15px]">{ui('group.noChem')}</p>}
    </div>
  );
}
