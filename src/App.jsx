import React, { lazy, Suspense, useState } from 'react';
import { LanguageProvider, useLang } from './i18n/useLang.jsx';
import { useRoute, href } from './hooks/useRoute.js';
import { useOrchard, useFontScale } from './hooks/useOrchard.js';
import { Icon } from './ui/kit.jsx';
import Home from './screens/Home.jsx';
import Diagnose from './screens/Diagnose.jsx';
import GroupPage from './screens/GroupPage.jsx';
import { ChemicalList, ChemicalDetail } from './screens/Chemicals.jsx';
import Rotate from './screens/Rotate.jsx';
import { LearnList, Lesson } from './screens/Learn.jsx';

const Classic = lazy(() => import('./screens/Classic.jsx'));

const NAV = [
  { id: 'home', icon: 'home', path: '', match: ['home', 'group'] },
  { id: 'diagnose', icon: 'search', path: 'diagnose', match: ['diagnose'] },
  { id: 'rotate', icon: 'rotate', path: 'rotate', match: ['rotate'] },
  { id: 'learn', icon: 'book', path: 'learn', match: ['learn', 'chem', 'organic'] },
];

function LanguageGate() {
  const { setLang } = useLang();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-stone-50">
      <img src="pwa-192x192.png" alt="" className="w-20 h-20 rounded-2xl" />
      <div className="text-2xl font-extrabold text-center">AgriPro 榴莲综合防治<br />Durian IPM</div>
      <div className="w-full max-w-xs space-y-3 mt-2">
        <button onClick={() => setLang('zh')} className="w-full min-h-[56px] rounded-xl bg-emerald-700 text-white text-xl font-extrabold">中文</button>
        <button onClick={() => setLang('en')} className="w-full min-h-[56px] rounded-xl bg-white border-2 border-stone-300 text-xl font-extrabold">English</button>
      </div>
    </div>
  );
}

function Shell() {
  const { lang, setLang, ui, chosen } = useLang();
  const route = useRoute();
  const [orchard, setOrchard] = useOrchard();
  const [, cycleFont] = useFontScale();

  if (!chosen) return <LanguageGate />;
  if (route.name === 'classic') return <Suspense fallback={null}><Classic /></Suspense>;

  let screen;
  switch (route.name) {
    case 'diagnose': screen = <Diagnose orchard={orchard} />; break;
    case 'group': screen = <GroupPage id={route.id} orchard={orchard} setOrchard={setOrchard} />; break;
    case 'chem': screen = route.id ? <ChemicalDetail id={route.id} /> : <ChemicalList key="all" />; break;
    case 'organic': screen = <ChemicalList key="organic" initialKind="organic" />; break;
    case 'rotate': screen = <Rotate pestId={route.id} />; break;
    case 'learn': screen = route.id ? <Lesson id={route.id} /> : <LearnList />; break;
    default: screen = <Home orchard={orchard} setOrchard={setOrchard} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-40 bg-emerald-800 text-white safe-top shadow">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-2">
          <a href={href('')} className="flex items-center gap-2 min-w-0 flex-1">
            <img src="pwa-192x192.png" alt="" className="w-8 h-8 rounded-lg" />
            <span className="font-extrabold text-[17px] truncate">{ui('app.title')}</span>
          </a>
          <button onClick={cycleFont} className="min-h-[40px] min-w-[44px] rounded-lg bg-white/10 font-extrabold" aria-label={ui('app.textSize')}>Aa</button>
          <button onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} className="min-h-[40px] min-w-[44px] rounded-lg bg-white/10 font-extrabold" aria-label="Language">
            {lang === 'zh' ? 'EN' : '中'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 pb-28">{screen}</main>

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-200" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-2xl mx-auto grid grid-cols-4">
          {NAV.map(n => {
            const on = n.match.includes(route.name);
            return (
              <a key={n.id} href={href(n.path)} aria-current={on ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 h-[64px] text-[12px] font-bold ${on ? 'text-emerald-800' : 'text-stone-500'}`}>
                <span className={`px-4 py-1 rounded-full ${on ? 'bg-emerald-100' : ''}`}><Icon name={n.icon} className="w-6 h-6" /></span>
                {ui(`nav.${n.id}`)}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  );
}
