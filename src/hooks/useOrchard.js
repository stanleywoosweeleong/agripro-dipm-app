import { useEffect, useState } from 'react';

// Per-device orchard context: crop stage, weather, last-sprayed groups.
// Kept in localStorage (wrapped — private mode must not break the app).
const KEY = 'agripro_orchard_v1';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

export function useOrchard() {
  const [state, setState] = useState(() => ({ stage: null, weather: null, recentMoa: [], ...read() }));
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);
  const set = (patch) => setState(s => ({ ...s, ...patch }));
  return [state, set];
}

const FS_KEY = 'agripro_fontscale';
export function useFontScale() {
  const [scale, setScale] = useState(() => { try { return Number(localStorage.getItem(FS_KEY)) || 1; } catch { return 1; } });
  useEffect(() => {
    document.documentElement.style.fontSize = `${scale * 100}%`;
    try { localStorage.setItem(FS_KEY, String(scale)); } catch { /* ignore */ }
  }, [scale]);
  const cycle = () => setScale(s => (s >= 1.3 ? 1 : Math.round((s + 0.15) * 100) / 100));
  return [scale, cycle];
}
