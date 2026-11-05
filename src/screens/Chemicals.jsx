import React, { useMemo, useState } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Card, Section, Icon, Badge, Callout, BackBar, Chip, openExternal } from '../ui/kit.jsx';
import { GroupArt } from '../components/Art.jsx';
import {
  CHEMICALS, searchChemicals, findRemovedActive, chemById, moaInfo, chemsForMoa, CAUTION_TEXT, LAST_REVIEWED, organicNote,
} from '../core/chemDb.js';
import { MOA_LABELS, TOX_LABEL, BEE_LABEL, BENEFICIAL_LABEL, FUNGUS_LABEL, ENV_LABEL, CHART_PESTS } from '../core/moaDb.js';
import { GROUPS, groupById } from '../core/groups.js';
import { groupsForMoa } from '../core/recommend.js';
import { GROUP_FOR_CHART } from '../core/rotation.js';
import { href } from '../hooks/useRoute.js';
import { moaCode, TOX_TONE } from './GroupPage.jsx';

const KINDS = ['all', 'organic', 'insecticide', 'fungicide'];
const KIND_LABEL = {
  all: { en: 'All', zh: '全部' }, organic: { en: 'Organic & bio', zh: '有机与生物' }, insecticide: { en: 'Insect & mite', zh: '杀虫杀螨' },
  fungicide: { en: 'Disease', zh: '杀菌' }, bio: { en: 'Biological', zh: '生物' },
};
const SITE_LABEL = (lang, s) => MOA_LABELS[lang][`site_${s}`];
const SITE_TONE = { neural: 'violet', respiratory: 'blue', growth: 'green', midgut: 'amber', unknown: 'grey' };
const RISK_TONE = { low: 'green', mid: 'amber', high: 'red' };
const BEE_TONE = { high: 'red', wet: 'amber', mod: 'amber', low: 'green' };

/** The banned/removed notice — an honest answer instead of "no matches". */
export function RemovedNotice({ r }) {
  const { t, lang, ui } = useLang();
  return (
    <div className="rounded-2xl border-2 border-rose-500 bg-rose-50 p-4">
      <div className="flex items-center gap-2 text-rose-800">
        <Icon name="warn" className="w-6 h-6" />
        <div className="text-lg font-extrabold">{lang === 'zh' ? r.zh : r.en} — {r.hhp ? ui('status.hhp') : ui('status.banned')}</div>
      </div>
      <p className="text-[16px] text-rose-900 mt-2 leading-snug">{lang === 'zh' ? r.basisZh : r.basisEn}</p>
      <p className="text-[15px] text-rose-900 mt-2">{ui('chem.notListed')}</p>
      {r.groups.length > 0 && (
        <>
          <div className="mt-3 font-bold text-[15px] text-rose-900">{ui('chem.alternatives')}</div>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {r.groups.map(gid => (
              <a key={gid} href={href(`group/${gid}`)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-rose-300 font-bold text-[15px]">
                <GroupArt id={gid} className="w-6 h-6" /> {t(groupById(gid).name)}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ChemicalList({ initialKind = 'all' }) {
  const { t, ui } = useLang();
  const [q, setQ] = useState('');
  const [kind, setKind] = useState(initialKind);
  const list = useMemo(() => searchChemicals(q, kind), [q, kind]);
  const removed = useMemo(() => findRemovedActive(q), [q]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">{kind === 'organic' ? ui('chem.organicTitle') : ui('chem.title')}</h1>
      <p className="text-[15px] text-stone-600 leading-snug">{kind === 'organic' ? ui('chem.organicHint') : ui('chem.hint')}</p>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder={ui('chem.search')} autoComplete="off"
        className="mt-3 w-full min-h-[52px] rounded-xl border-2 border-stone-300 px-3 bg-white focus:border-emerald-600 outline-none" />
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
        {KINDS.map(k => <Chip key={k} on={kind === k} onClick={() => setKind(k)} className="whitespace-nowrap">{t(KIND_LABEL[k])}</Chip>)}
      </div>

      {removed && <div className="mt-4"><RemovedNotice r={removed} /></div>}

      <div className="mt-4 space-y-2">
        {!removed && list.length === 0 && <Callout tone="grey" icon="search">{ui('chem.none')}</Callout>}
        {list.map(c => <ChemRow key={c.id} c={c} />)}
      </div>
      <p className="mt-4 text-[13px] text-stone-500">{ui('chem.legal')} {CHEMICALS.length} {ui('chem.count')} · {LAST_REVIEWED}</p>
    </div>
  );
}

function ChemRow({ c }) {
  const { t, lang } = useLang();
  const info = moaInfo(c.moa);
  return (
    <a href={href(`chem/${c.id}`)} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200 active:bg-stone-50">
      <div className="min-w-0 flex-1">
        <div className="font-extrabold text-[16px] leading-tight">{c.name.en} <span className="font-bold text-stone-600">{c.name.zh !== c.name.en ? c.name.zh : ''}</span></div>
        <div className="flex flex-wrap gap-1.5 mt-1">
          <Badge tone="green">{moaCode(info) || t(info.name)}</Badge>
          {c.organic && <Badge tone="lime"><Icon name="leaf" className="w-3.5 h-3.5" /> {t({ en: 'Organic', zh: '有机' })}</Badge>}
          {c.site && <Badge tone={SITE_TONE[c.site]}>{SITE_LABEL(lang, c.site)}</Badge>}
          {c.bee === 'high' && <Badge tone="red"><Icon name="bee" className="w-3.5 h-3.5" /></Badge>}
          {(c.tox === 'Ia' || c.tox === 'Ib') && <Badge tone="red">WHO {c.tox}</Badge>}
        </div>
      </div>
      <Icon name="chevron" className="w-5 h-5 text-stone-400" />
    </a>
  );
}

export function ChemicalDetail({ id }) {
  const { t, ui, lang } = useLang();
  const c = chemById(id);
  if (!c) return <div><BackBar /><p>Not found.</p></div>;
  const info = moaInfo(c.moa);
  const L = MOA_LABELS[lang];
  const groups = [...new Set([
    ...groupsForMoa(GROUPS, c.moa).map(g => g.id),
    ...c.chartPests.map(p => GROUP_FOR_CHART[p]).filter(Boolean),
  ])].map(groupById);
  const siblings = chemsForMoa(c.moa).filter(x => x.id !== c.id);
  const mrlURL = c.foodmateId
    ? `http://2763.foodmate.net/pesticides/limit/${c.foodmateId}.html`
    : `https://www.google.com/search?q=${encodeURIComponent(`site:2763.foodmate.net ${c.name.en}`)}`;
  const dt50URL = `https://www.google.com/search?q=${encodeURIComponent(`${c.name.en} DT50 PPDB`)}`;

  return (
    <div>
      <BackBar />
      <h1 className="text-2xl font-extrabold leading-tight">{c.name.en}</h1>
      {c.name.zh !== c.name.en && <div className="text-xl font-bold text-stone-700">{c.name.zh}</div>}
      <div className="flex flex-wrap gap-1.5 mt-2">
        <Badge tone="green">{moaCode(info) || t(info.name)}</Badge>
        <Badge>{t(info.name)}</Badge>
        {c.site && <Badge tone={SITE_TONE[c.site]}>{SITE_LABEL(lang, c.site)}</Badge>}
      </div>

      {c.hhpNote && <div className="mt-3"><Callout tone="amber" title={ui('chem.hhpNote')}>{t(c.hhpNote)}</Callout></div>}
      {c.organic && <div className="mt-3"><Callout tone="lime" icon="leaf" title={ui('chem.organic')}>{t(organicNote(c))}</Callout></div>}
      {c.caution && <div className="mt-3"><Callout>{t(CAUTION_TEXT[c.caution])}</Callout></div>}

      <Section title={ui('chem.how')}>
        <Card className="p-4">
          {info.how && <p className="text-[16px] leading-snug font-semibold">{t(info.how)}</p>}
          {info.detail && <p className="text-[15px] leading-snug text-stone-700 mt-2">{t(info.detail)}</p>}
          {info.note && <p className="text-[15px] leading-snug text-emerald-900 mt-2">{t(info.note)}</p>}
        </Card>
      </Section>

      {(c.mobility || c.translaminar || c.twoWay) && (
        <Section title={ui('chem.reaches')}>
          <div className="flex flex-wrap gap-1.5">
            {c.mobility && <Badge tone="blue">{L[`mob_${c.mobility}`]}</Badge>}
            {c.translaminar && <Badge tone="blue">{L.tl}</Badge>}
            {c.twoWay && <Badge tone="blue">{L.ud}</Badge>}
          </div>
        </Section>
      )}

      <Section title={ui('chem.safety')}>
        <div className="space-y-2">
          <Row label={ui('chem.who')}><Badge tone={TOX_TONE[c.tox]}>{c.tox === 'NL' ? TOX_LABEL[lang].NL : `${c.tox} · ${TOX_LABEL[lang][c.tox]}`}</Badge></Row>
          {c.bee && BEE_LABEL[c.bee] && <Row label={ui('chem.bee')}><Badge tone={BEE_TONE[c.bee]}>{t(BEE_LABEL[c.bee])}</Badge></Row>}
          {c.beneficial && <Row label={ui('chem.beneficial')}><span className="text-[15px]">{t(BENEFICIAL_LABEL[c.beneficial])}</span></Row>}
          {c.fungusCompat && <Row label={ui('chem.fungus')}><span className="text-[15px]">{t(FUNGUS_LABEL[c.fungusCompat])}</span></Row>}
          {c.env.length > 0 && <Row label={ui('chem.timing')}>{c.env.map(e => <div key={e} className="text-[15px]">{t(ENV_LABEL[e])}</div>)}</Row>}
          {c.eu && <Row label={ui('chem.eu')}><span className="text-[15px]">{t(c.eu)}</span></Row>}
          <Row label={ui('chem.phi')}><span className="text-[15px]">{ui('chem.phiText')}</span></Row>
        </div>
      </Section>

      {info.crossRes && (
        <Section title={ui('chem.crossRes')}>
          <Card className="p-4"><p className="text-[15px] leading-snug">{t(info.crossRes)}</p></Card>
        </Section>
      )}

      {Object.keys(c.risk).length > 0 && (
        <Section title={ui('chem.resistanceBy')}>
          <div className="space-y-2">
            {Object.entries(c.risk).map(([p, r]) => {
              const pest = CHART_PESTS.find(x => x.id === p);
              return (
                <Card key={p} className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[15px]">{lang === 'zh' ? pest.zh : pest.en}</span>
                    <Badge tone={RISK_TONE[r]}>{L[`risk_${r}`]}</Badge>
                  </div>
                  {c.notes[p] && <p className="text-[14px] text-stone-600 mt-1 leading-snug">{L[`note_${c.notes[p]}`]}</p>}
                </Card>
              );
            })}
          </div>
        </Section>
      )}

      {groups.length > 0 && (
        <Section title={ui('chem.usedFor')}>
          <div className="flex flex-wrap gap-2">
            {groups.map(g => (
              <a key={g.id} href={href(`group/${g.id}`)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold text-[15px]">
                <GroupArt id={g.id} className="w-6 h-6" /> {t(g.name)}
              </a>
            ))}
          </div>
        </Section>
      )}

      {siblings.length > 0 && (
        <Section title={ui('chem.sameGroup')}>
          <div className="flex flex-wrap gap-1.5">
            {siblings.map(s => <a key={s.id} href={href(`chem/${s.id}`)} className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-[14px] font-bold">{t(s.name)}</a>)}
          </div>
        </Section>
      )}

      <Section title={ui('chem.lookups')}>
        <div className="space-y-2">
          <a href={mrlURL} onClick={e => openExternal(e, mrlURL)} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-stone-300 font-bold text-emerald-900">
            <Icon name="link" /> {ui('chem.mrl')}
          </a>
          <a href={dt50URL} onClick={e => openExternal(e, dt50URL)} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-stone-300 font-bold text-emerald-900">
            <Icon name="link" /> {ui('chem.dt50')}
          </a>
          <p className="text-[13px] text-stone-500 leading-snug">{ui('chem.mrlNote')}</p>
        </div>
      </Section>

      <p className="mt-6 text-[13px] text-stone-500 leading-snug">{ui('chem.legal')}</p>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="p-3 rounded-xl bg-white border border-stone-200">
      <div className="text-[13px] font-bold text-stone-500 uppercase tracking-wide mb-1">{label}</div>
      <div>{children}</div>
    </div>
  );
}
