import { useEffect, useState, useCallback } from 'react';

// Tiny hash router: "#/group/thrips" → { name: 'group', id: 'thrips' }.
// Hash routing keeps GitHub Pages happy and makes the phone's back button work.
const parse = () => {
  const [name = 'home', id = null, sub = null] = window.location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  return { name: name || 'home', id, sub };
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => { setRoute(parse()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const go = (path) => { window.location.hash = path.startsWith('#') ? path : `#/${path}`; };
export const back = () => (window.history.length > 1 ? window.history.back() : go(''));
export const href = (path) => `#/${path}`;
export const useGo = () => useCallback(go, []);
