import React from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { back } from '../hooks/useRoute.js';

const PATHS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  flask: '<path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
  rotate: '<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V21h16"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  chevron: '<path d="M9 18l6-6-6-6"/>',
  warn: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  leaf: '<path d="M5 19C5 9 11 5 20 4c0 9-4 15-14 15Z"/><path d="M5 19c3-6 7-9 11-11"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  bee: '<ellipse cx="12" cy="14" rx="5" ry="6"/><path d="M7 12h10M7 16h10"/><path d="M9 8C6 3 2 5 4 8M15 8c3-5 7-3 5 0"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  drop: '<path d="M12 3C8 9 5 12 5 15a7 7 0 0 0 14 0c0-3-3-6-7-12Z"/>',
};

export function Icon({ name, className = 'w-5 h-5', strokeWidth = 2 }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PATHS[name] || '' }} />
  );
}

export const Card = ({ className = '', children, ...p }) => (
  <div className={`bg-white rounded-2xl border border-stone-200 shadow-sm ${className}`} {...p}>{children}</div>
);

export function Section({ title, sub, children, className = '' }) {
  return (
    <section className={`mt-6 ${className}`}>
      {title && <h2 className="text-lg font-extrabold text-stone-900 leading-tight">{title}</h2>}
      {sub && <p className="text-[15px] text-stone-600 mt-0.5 leading-snug">{sub}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function Chip({ on, onClick, children, className = '' }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={!!on}
      className={`min-h-[44px] px-3.5 py-2 rounded-xl border-2 text-[15px] font-bold text-left transition-colors ${on
        ? 'bg-emerald-700 border-emerald-700 text-white'
        : 'bg-white border-stone-300 text-stone-800 active:bg-stone-100'} ${className}`}>
      {children}
    </button>
  );
}

const TONE = {
  green: 'bg-emerald-50 text-emerald-900 border-emerald-300',
  amber: 'bg-amber-50 text-amber-900 border-amber-300',
  red: 'bg-rose-50 text-rose-900 border-rose-300',
  blue: 'bg-sky-50 text-sky-900 border-sky-300',
  grey: 'bg-stone-100 text-stone-700 border-stone-300',
  violet: 'bg-violet-50 text-violet-900 border-violet-300',
  lime: 'bg-lime-50 text-lime-900 border-lime-400',
};
export const Badge = ({ tone = 'grey', children, className = '' }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[13px] font-bold leading-tight ${TONE[tone]} ${className}`}>{children}</span>
);

export function Callout({ tone = 'amber', icon = 'warn', title, children }) {
  return (
    <div className={`rounded-xl border-2 p-3 flex gap-2.5 ${TONE[tone]}`}>
      <Icon name={icon} className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="text-[15px] leading-snug">
        {title && <div className="font-extrabold mb-0.5">{title}</div>}
        {children}
      </div>
    </div>
  );
}

export function BackBar({ title }) {
  const { ui } = useLang();
  return (
    <div className="flex items-center gap-2 -mx-1 mb-2">
      <button onClick={back} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl active:bg-stone-200" aria-label={ui('common.back')}>
        <Icon name="back" className="w-6 h-6" />
      </button>
      {title && <h1 className="text-xl font-extrabold text-stone-900 leading-tight truncate">{title}</h1>}
    </div>
  );
}

export const Bullets = ({ items, t }) => (
  <ul className="space-y-1.5">
    {items.map((x, i) => (
      <li key={i} className="flex gap-2 text-[16px] leading-snug text-stone-800">
        <span className="text-emerald-600 font-black mt-0.5">•</span><span>{t(x)}</span>
      </li>
    ))}
  </ul>
);

/** Opens links reliably from in-app browsers (WhatsApp etc.) — from the rotation guide. */
export const openExternal = (e, url) => {
  if (e) { e.stopPropagation(); e.preventDefault(); }
  try { const w = window.open(url, '_blank', 'noopener,noreferrer'); if (!w) window.location.href = url; }
  catch { window.location.href = url; }
};
