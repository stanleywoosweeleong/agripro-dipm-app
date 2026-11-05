import React from 'react';
import { useLang } from '../i18n/useLang.jsx';
import { Chip, Badge } from './kit.jsx';
import { STAGE_TERMS } from '../core/groups.js';
import { STAGE_LABEL } from '../core/moa.js';
import { href } from '../hooks/useRoute.js';

/** "Which stage do you see most?" — eggs / young / adults / mixed, in the group's own words. */
export function StagePicker({ groupId, value, onChange }) {
  const { t, ui } = useLang();
  const terms = STAGE_TERMS[groupId];
  if (!terms) return null;
  const opts = [
    ['young', t(terms.young)],
    ['adults', t(terms.adult)],
    ['eggs', ui('stage.eggs')],
    ['mixed', ui('stage.mixed')],
  ];
  return (
    <div className="rounded-xl border-2 border-sky-200 bg-sky-50 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-extrabold text-[15px]">{ui('stage.question')}</div>
        <a href={href('learn/lifecycle')} className="text-[13px] font-bold text-sky-800 underline shrink-0">{ui('stage.why')}</a>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {opts.map(([k, label]) => (
          <Chip key={k} on={value === k} onClick={() => onChange(value === k ? null : k)} className="text-[14px] py-2">{label}</Chip>
        ))}
      </div>
      {value === 'adults' && terms.adultNote && <p className="mt-2 text-[14px] text-sky-900 leading-snug font-semibold">{t(terms.adultNote)}</p>}
    </div>
  );
}

/** "Kills: eggs · young · adults" — which life stages a class works on. */
export function KillsBadges({ stages }) {
  const { t, ui } = useLang();
  if (!stages?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[13px] font-bold text-stone-500">{ui('stage.kills')}</span>
      {['egg', 'young', 'adult'].map(s => (
        <Badge key={s} tone={stages.includes(s) ? 'blue' : 'grey'} className={stages.includes(s) ? '' : 'line-through opacity-60'}>{t(STAGE_LABEL[s])}</Badge>
      ))}
    </div>
  );
}
