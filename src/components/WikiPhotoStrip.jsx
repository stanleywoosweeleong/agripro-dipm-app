import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================
// WikiPhotoStrip — embedded reference photos from Wikimedia Commons
// ============================================================
// Why Wikimedia: free, CC-licensed, CORS-enabled, no API key required.
// Strategy: query Commons for image files associated with the scientific name,
// then build proper thumbnail URLs. Cache by scientific name in sessionStorage
// so revisiting the same pest is instant.
// Coverage: common species have many photos, obscure ones have few or none —
// in the latter case, the strip simply hides and the Google fallback button remains.

const CACHE_PREFIX = 'agripro_wiki_photos:';
const MAX_PHOTOS = 4;            // Show up to N thumbnails per pest
const THUMB_PX = 240;            // Server-rendered thumbnail width
const FETCH_TIMEOUT_MS = 8000;   // Don't hang the UI on slow networks

// In-flight requests are deduplicated globally so two cards with the same
// scientific name don't both hit the API.
const inFlight = new Map();

async function fetchWikiPhotos(scientificName) {
  if (!scientificName) return [];

  // Memory + sessionStorage cache
  const cacheKey = CACHE_PREFIX + scientificName;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) { /* ignore */ }

  // Deduplicate concurrent requests for the same key
  if (inFlight.has(cacheKey)) return inFlight.get(cacheKey);

  const promise = (async () => {
    // Strip genus abbreviations like "Spp." and noise; keep the first species name
    const queryName = scientificName.split('/')[0].split(',')[0].trim();

    // Wikimedia Commons API — search for files matching the species name
    const url = new URL('https://commons.wikimedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',                                // CORS
      generator: 'search',
      gsrsearch: `${queryName} filetype:bitmap`,  // bitmap = JPG/PNG photographs
      gsrnamespace: '6',                          // File: namespace
      gsrlimit: String(MAX_PHOTOS * 2),           // Over-fetch; some may be invalid
      prop: 'imageinfo',
      iiprop: 'url|size|mime',
      iiurlwidth: String(THUMB_PX),
    }).toString();

    // Abortable fetch with timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let photos = [];
    try {
      const resp = await fetch(url.toString(), { signal: controller.signal });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const pages = data?.query?.pages || {};
      photos = Object.values(pages)
        .filter(p => p.imageinfo?.[0]?.mime?.startsWith('image/'))
        .filter(p => !/svg|icon|map|logo|distribution/i.test(p.title))  // skip non-specimen images
        .slice(0, MAX_PHOTOS)
        .map(p => ({
          thumb: p.imageinfo[0].thumburl || p.imageinfo[0].url,
          full: p.imageinfo[0].url,
          title: p.title.replace(/^File:/, '').replace(/\.(jpg|jpeg|png|webp)$/i, ''),
          descUrl: p.imageinfo[0].descriptionurl,
        }));
    } catch (e) {
      // Network failure, timeout, or offline — just return empty
      photos = [];
    } finally {
      clearTimeout(timer);
    }

    try { sessionStorage.setItem(cacheKey, JSON.stringify(photos)); } catch (e) { /* full */ }
    inFlight.delete(cacheKey);
    return photos;
  })();

  inFlight.set(cacheKey, promise);
  return promise;
}

// ============================================================
// Lightbox modal — full-screen image viewer
// ============================================================
function PhotoLightbox({ photo, lang, onClose }) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!photo) return null;

  const closeLabel = lang === 'zh' ? '关闭' : 'Close';
  const sourceLabel = lang === 'zh' ? '维基共享 · 点击查看来源' : 'Wikimedia Commons · view source';

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 backdrop-blur-sm"
        aria-label={closeLabel}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        {closeLabel}
      </button>

      <div
        className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.full}
          alt={photo.title}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
        />
        <a
          href={photo.descUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-300 hover:text-emerald-200 text-xs font-bold underline"
          onClick={(e) => e.stopPropagation()}
        >
          {sourceLabel}
        </a>
      </div>
    </div>
  );
}

// ============================================================
// Main component
// ============================================================
export function WikiPhotoStrip({ scientificName, lang = 'en' }) {
  const [photos, setPhotos] = useState(null);       // null = not loaded, [] = loaded but empty
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(null);       // photo opened in lightbox
  const [inView, setInView] = useState(false);
  const stripRef = useRef(null);

  // Lazy-load: only fetch when the strip scrolls into view
  useEffect(() => {
    if (inView) return;
    const el = stripRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: '300px' }  // start loading a bit before the card is visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  // Fetch when in view
  useEffect(() => {
    if (!inView) return;
    if (!scientificName) return;
    if (photos !== null) return;
    setLoading(true);
    let cancelled = false;
    fetchWikiPhotos(scientificName).then((p) => {
      if (cancelled) return;
      setPhotos(p);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [inView, scientificName, photos]);

  const heading = lang === 'zh' ? '参考照片' : 'Reference Photos';
  const sourceNote = lang === 'zh' ? '来源：维基共享' : 'via Wikimedia Commons';
  const loadingLabel = lang === 'zh' ? '正在加载照片...' : 'Loading photos...';

  // If nothing was found, hide the entire section (user still has the Google fallback button)
  if (photos !== null && photos.length === 0 && !loading) return null;

  return (
    <div ref={stripRef} className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{heading}</span>
        {photos && photos.length > 0 && (
          <span className="text-[10px] text-slate-400 font-medium">{sourceNote}</span>
        )}
      </div>
      {loading && (
        <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>{loadingLabel}</span>
        </div>
      )}
      {photos && photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(p)}
              className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all relative group"
              title={p.title}
              aria-label={p.title}
            >
              <img
                src={p.thumb}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </button>
          ))}
        </div>
      )}
      {active && <PhotoLightbox photo={active} lang={lang} onClose={() => setActive(null)} />}
    </div>
  );
}
