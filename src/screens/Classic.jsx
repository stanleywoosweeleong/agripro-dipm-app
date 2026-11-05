import React, { lazy, Suspense } from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { go } from '../hooks/useRoute.js';

// The previous (v2) app, kept reachable during the transition so nothing is lost:
// full species catalogue, tank-mix guide, DT50 tables, risk simulator.
const EnApp = lazy(() => import('../legacy/EnApp.jsx'));
const ZhApp = lazy(() => import('../legacy/ZhApp.jsx'));

export default function Classic() {
  const { lang, ui } = useLang();
  return (
    <div>
      <button onClick={() => go('')} className="fixed bottom-4 right-4 z-[300] bg-emerald-700 text-white font-extrabold px-4 py-3 rounded-full shadow-xl">
        ← {ui('learn.exitClassic')}
      </button>
      <Suspense fallback={<div className="p-8 text-center">…</div>}>
        {lang === 'zh' ? <ZhApp /> : <EnApp />}
      </Suspense>
    </div>
  );
}
