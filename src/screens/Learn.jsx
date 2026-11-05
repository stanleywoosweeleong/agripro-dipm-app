import React, { lazy, Suspense } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Card, Section, Icon, BackBar } from '../ui/kit.jsx';
import { MouthpartsFigure, LifecycleFigure } from '../components/Art.jsx';
import { LESSONS } from '../core/lessons.js';
import { MIX_SEQUENCE } from '../core/moaDb.js';
import { href } from '../hooks/useRoute.js';

// Figures attached to specific lessons (illustrations adapted from the Taijiang guide).
const FIGURES = {
  mouthparts: (t) => <MouthpartsFigure t={t} />,
  lifecycle: (t) => <LifecycleFigure t={t} />,
  safety: (t, lang) => (
    <ol className="space-y-1.5">
      {MIX_SEQUENCE.map(s => (
        <li key={s.step} className="flex gap-2.5 items-start">
          <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-extrabold text-[14px] flex items-center justify-center shrink-0">{s.step}</span>
          <span className="text-[16px] leading-snug pt-0.5">{lang === 'zh' ? s.zh : s.en}</span>
        </li>
      ))}
    </ol>
  ),
  hazard: (t) => (
    <div className="grid grid-cols-3 gap-2 text-center">
      {[
        [{ en: 'Pure active', zh: '纯原药' }, { en: 'Factory · ~100%', zh: '工厂 · 约100%' }, { en: 'WHO class is rated here', zh: 'WHO等级按此评定' }, 'bg-rose-100 border-rose-400'],
        [{ en: 'Your bottle', zh: '你的药瓶' }, { en: 'e.g. 1.8% EC', zh: '如 1.8% 乳油' }, { en: 'Mixing = highest risk', zh: '配药 = 风险最高' }, 'bg-amber-100 border-amber-400'],
        [{ en: 'Spray tank', zh: '药箱' }, { en: 'Diluted again hundreds of times', zh: '再稀释几百倍' }, { en: 'Keep off water & flowers', zh: '远离水源和花朵' }, 'bg-emerald-100 border-emerald-400'],
      ].map(([title, conc, note, cls], i) => (
        <div key={i} className={`rounded-xl border-2 p-2 ${cls}`}>
          <div className="font-extrabold text-[15px] leading-tight">{t(title)}</div>
          <div className="text-[13px] mt-1 leading-tight">{t(conc)}</div>
          <div className="text-[12px] font-bold mt-1.5 leading-tight">{t(note)}</div>
        </div>
      ))}
    </div>
  ),
};
const FIGURE_TITLE = {
  mouthparts: { en: 'Five mouth types', zh: '五种口器' },
  lifecycle: { en: 'Which stage each product hits', zh: '各类药剂作用于哪个虫态' },
  safety: { en: 'Tank-mix order', zh: '调配顺序' },
  hazard: { en: 'Where the danger is', zh: '危险在哪里' },
};

export function LearnList() {
  const { t, ui } = useLang();
  return (
    <div>
      <h1 className="text-2xl font-extrabold">{ui('learn.title')}</h1>
      <p className="text-[15px] text-stone-600">{ui('learn.sub')}</p>
      <div className="space-y-2 mt-4">
        {LESSONS.map((l, i) => (
          <a key={l.id} href={href(`learn/${l.id}`)} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-stone-200 active:bg-stone-50">
            <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-[16px] leading-tight">{t(l.title)}</div>
              <div className="text-[14px] text-stone-600 leading-snug">{t(l.summary)}</div>
            </div>
            <Icon name="chevron" className="w-5 h-5 text-stone-400" />
          </a>
        ))}
      </div>
      <Section title={ui('learn.products')} sub={ui('learn.productsSub')}>
        <div className="grid grid-cols-2 gap-2">
          <a href={href('organic')} className="p-4 rounded-xl bg-lime-50 border border-lime-300 font-bold flex items-center justify-between">{ui('group.trackOrganic')} <Icon name="chevron" className="w-5 h-5" /></a>
          <a href={href('chem')} className="p-4 rounded-xl bg-white border border-stone-300 font-bold flex items-center justify-between">{ui('chem.filterAll')} <Icon name="chevron" className="w-5 h-5" /></a>
        </div>
      </Section>
      <Section title={ui('learn.classic')} sub={ui('learn.classicSub')}>
        <a href={href('classic')} className="flex items-center justify-between p-4 rounded-xl bg-stone-100 border border-stone-300 font-bold">
          {ui('learn.openClassic')} <Icon name="chevron" className="w-5 h-5" />
        </a>
      </Section>
    </div>
  );
}

export function Lesson({ id }) {
  const { t, lang, ui } = useLang();
  const l = LESSONS.find(x => x.id === id);
  if (!l) return <div><BackBar /><p>Not found.</p></div>;
  const body = l.body[lang] || l.body.en;
  const share = () => {
    const text = `${t(l.title)}\n\n${body.join('\n')}\n\n— ${ui('app.title')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };
  return (
    <div>
      <BackBar />
      <h1 className="text-2xl font-extrabold leading-tight">{t(l.title)}</h1>
      <p className="text-[16px] text-stone-600 mt-1">{t(l.summary)}</p>
      <Card className="p-4 mt-4 space-y-3">
        {body.map((p, i) => p.startsWith('• ')
          ? <div key={i} className="flex gap-2 text-[17px] leading-snug"><span className="text-emerald-600 font-black">•</span><span>{p.slice(2)}</span></div>
          : <p key={i} className="text-[17px] leading-relaxed">{p}</p>)}
      </Card>
      {FIGURES[l.id] && (
        <Section title={t(FIGURE_TITLE[l.id])}>{FIGURES[l.id](t, lang)}</Section>
      )}
      <button onClick={share} className="mt-6 w-full min-h-[52px] rounded-xl bg-[#25D366] text-white font-extrabold flex items-center justify-center gap-2">
        <Icon name="share" /> {ui('group.share')}
      </button>
    </div>
  );
}
