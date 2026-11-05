import React, { useMemo, useState, useEffect } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Card, Section, Icon, Badge, Chip } from '../ui/kit.jsx';
import { PestIcon } from '../components/Art.jsx';
import { MOA_LABELS, GROUP_NAMES, CHART_PESTS } from '../core/moaDb.js';
import { rotationFor, groupsForChartPest, GROUP_FOR_CHART } from '../core/rotation.js';
import { groupById } from '../core/groups.js';
import { moaInfo, moaKeyFromIrac } from '../core/chemDb.js';
import { KillsBadges } from '../ui/StagePicker.jsx';
import { href, go } from '../hooks/useRoute.js';

const SITE = {
  neural: 'border-l-violet-500 bg-violet-50', respiratory: 'border-l-sky-500 bg-sky-50',
  growth: 'border-l-emerald-500 bg-emerald-50', midgut: 'border-l-amber-500 bg-amber-50', unknown: 'border-l-stone-400 bg-stone-50',
};
const RISK_TONE = { low: 'green', mid: 'amber', high: 'red' };

// Rotation Helper (merged from the Pest-MoA rotation guide).
export default function Rotate({ pestId }) {
  const { t, lang, ui } = useLang();
  const L = MOA_LABELS[lang];
  const pest = CHART_PESTS.some(p => p.id === pestId) ? pestId : null;
  const [last, setLast] = useState('');
  useEffect(() => setLast(''), [pest]);

  const groups = useMemo(() => (pest ? groupsForChartPest(pest) : []), [pest]);
  const rot = useMemo(() => (pest && last ? rotationFor(pest, last) : null), [pest, last]);
  const gName = (g) => `${g} · ${GROUP_NAMES[lang][g] || ''}`;

  return (
    <div>
      <h1 className="text-2xl font-extrabold">{ui('rot.title')}</h1>
      <p className="text-[15px] text-stone-600 leading-snug">{ui('rot.sub')}</p>

      <Section title={L.selectPest}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CHART_PESTS.map(p => (
            <button key={p.id} onClick={() => go(`rotate/${p.id}`)}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 min-h-[88px] ${pest === p.id ? 'border-emerald-700 bg-emerald-50' : 'border-stone-200 bg-white'}`}>
              <PestIcon pest={p.id} className="w-10 h-10" />
              <span className="text-[14px] font-bold text-center leading-tight">{lang === 'zh' ? p.zh : p.en}</span>
            </button>
          ))}
        </div>
        {pest && GROUP_FOR_CHART[pest] && (
          <a href={href(`group/${GROUP_FOR_CHART[pest]}`)} className="mt-2 inline-flex items-center gap-1 text-[15px] font-bold text-emerald-800 underline">
            {ui('rot.groupLink')}: {t(groupById(GROUP_FOR_CHART[pest]).name)} <Icon name="chevron" className="w-4 h-4" />
          </a>
        )}
      </Section>

      {pest && (
        <Section title={L.lastUsed}>
          <div className="flex flex-wrap gap-2">
            {groups.map(g => <Chip key={g} on={last === g} onClick={() => setLast(last === g ? '' : g)} className="text-[14px] py-1.5 min-h-[40px]">{gName(g)}</Chip>)}
          </div>
        </Section>
      )}

      {rot && (
        <>
          <Section title={L.rotateAvoid}>
            <div className="flex flex-wrap gap-1.5">
              {rot.avoid.map(a => <ActiveLink key={a.n} a={a} tone="red" />)}
            </div>
          </Section>

          {rot.caution.length > 0 && (
            <Section title={`${L.rotateCaution} — ${rot.caution.map(c => c.g).join(' / ')}`}>
              <p className="text-[15px] text-amber-900 bg-amber-50 border border-amber-300 rounded-xl p-3 leading-snug">
                {rot.crossKind === 'partial' ? L.cautionNote_partial : L.cautionNote_shared}
              </p>
              <div className="space-y-2 mt-2">{rot.caution.map(grp => <GroupBlock key={grp.g} grp={grp} gName={gName} L={L} />)}</div>
            </Section>
          )}

          <Section title={L.rotateTo} sub={ui('rot.order')}>
            <div className="space-y-2">{rot.suggested.map(grp => <GroupBlock key={grp.g} grp={grp} gName={gName} L={L} />)}</div>
          </Section>
        </>
      )}

      <Section title={ui('rot.colourTitle')}>
        <Card className="p-4">
          <p className="text-[15px] leading-snug">{ui('rot.colourText')}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['neural', 'respiratory', 'growth', 'midgut', 'unknown'].map(s => (
              <span key={s} className={`px-2 py-1 rounded-md border-l-4 text-[13px] font-bold ${SITE[s]}`}>{L[`site_${s}`]}</span>
            ))}
          </div>
        </Card>
      </Section>

      <Section title={L.about}>
        <p className="text-[14px] text-stone-600 leading-snug">{L.aboutText}</p>
        <p className="text-[14px] text-stone-600 leading-snug mt-2"><b>{L.safetyTitle}:</b> {L.safetyText}</p>
      </Section>
    </div>
  );
}

function GroupBlock({ grp, gName, L }) {
  return (
    <div className={`rounded-xl border border-stone-200 border-l-4 p-3 ${SITE[grp.site] || SITE.unknown}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="font-extrabold text-[16px]">{gName(grp.g)}</div>
        {grp.differentSite === 1 && <Badge tone="green">{L.siteChanger}</Badge>}
      </div>
      <div className="mt-1.5"><KillsBadges stages={moaInfo(moaKeyFromIrac(grp.g)).stages} /></div>
      <div className="flex flex-wrap gap-1.5 mt-2">{grp.items.map(a => <ActiveLink key={a.n} a={a} />)}</div>
    </div>
  );
}

function ActiveLink({ a, tone }) {
  const { lang } = useLang();
  const L = MOA_LABELS[lang];
  const label = a.chem ? (lang === 'zh' && a.chem.name.zh !== a.n ? `${a.chem.name.zh}` : a.n) : a.n;
  return (
    <a href={a.chem ? href(`chem/${a.chem.id}`) : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-white text-[14px] font-bold ${tone === 'red' ? 'border-rose-300 text-rose-900' : 'border-stone-300'}`}>
      {label}
      <Badge tone={RISK_TONE[a.r]} className="text-[11px]">{L[`risk_${a.r}`]}</Badge>
      {a.chem?.bee === 'high' && <Icon name="bee" className="w-4 h-4 text-rose-600" />}
    </a>
  );
}
