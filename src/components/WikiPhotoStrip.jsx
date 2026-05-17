import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// WikiPhotoStrip — embedded reference photos from Wikimedia Commons
// ============================================================
// Photos come with full attribution: author + license, fetched per-image
// from the Wikimedia Commons API's extmetadata. Licenses vary per photo
// (CC0, CC BY, CC BY-SA, public domain, etc.) so we show each one's
// actual license rather than a blanket umbrella attribution.
//
// Coverage caveat: extmetadata is occasionally missing or partial for
// older uploads; we fall back to "See source page" + link in those cases.

const CACHE_PREFIX = 'agripro_wiki_photos_v2:'; // bumped — schema changed
const MAX_PHOTOS = 4;
const THUMB_PX = 240;
const FETCH_TIMEOUT_MS = 8000;

// Dedupe concurrent requests for the same scientific name
const inFlight = new Map();

// Strip HTML tags from extmetadata fields (Wikimedia returns HTML in some fields)
function stripHtml(s) {
  if (!s) return '';
  return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Map common license shortnames to a stable display label
function normaliseLicense(short, name) {
  const s = (short || name || '').trim();
  if (!s) return '';
  // Common patterns: "CC BY-SA 4.0", "CC0", "cc-by-sa-4.0", "Public domain"
  return s.replace(/^cc-/i, 'CC ').replace(/-/g, ' ').replace(/\bsa\b/i, 'SA').replace(/\bby\b/i, 'BY').toUpperCase().replace(/CC /, 'CC ');
}

async function fetchWikiPhotos(scientificName) {
  if (!scientificName) return [];

  const cacheKey = CACHE_PREFIX + scientificName;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) { /* ignore */ }

  if (inFlight.has(cacheKey)) return inFlight.get(cacheKey);

  const promise = (async () => {
    const queryName = scientificName.split('/')[0].split(',')[0].trim();

    const url = new URL('https://commons.wikimedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      generator: 'search',
      gsrsearch: `${queryName} filetype:bitmap`,
      gsrnamespace: '6',
      gsrlimit: String(MAX_PHOTOS * 2),
      prop: 'imageinfo',
      iiprop: 'url|size|mime|extmetadata',         // now includes extmetadata
      iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl|License|UsageTerms|Credit',
      iiurlwidth: String(THUMB_PX),
    }).toString();

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
        .filter(p => !/svg|icon|map|logo|distribution/i.test(p.title))
        .slice(0, MAX_PHOTOS)
        .map(p => {
          const info = p.imageinfo[0];
          const ext = info.extmetadata || {};
          const author = stripHtml(ext.Artist?.value) || stripHtml(ext.Credit?.value) || '';
          const licenseShort = ext.LicenseShortName?.value || ext.License?.value || '';
          const licenseUrl = ext.LicenseUrl?.value || '';
          return {
            thumb: info.thumburl || info.url,
            full: info.url,
            title: p.title.replace(/^File:/, '').replace(/\.(jpg|jpeg|png|webp)$/i, ''),
            descUrl: info.descriptionurl,
            author,
            license: normaliseLicense(licenseShort),
            licenseUrl,
          };
        });
    } catch (e) {
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
// Lightbox modal
// ============================================================
function PhotoLightbox({ photo, lang, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!photo) return null;

  const closeLabel = lang === 'zh' ? '关闭' : 'Close';
  const sourceLabel = lang === 'zh' ? '查看维基共享原始页面' : 'View on Wikimedia Commons';
  const photoByLabel = lang === 'zh' ? '摄影：' : 'Photo: ';
  const licenseLabel = lang === 'zh' ? '许可：' : 'License: ';
  const unknownAuthor = lang === 'zh' ? '佚名' : 'Unknown author';
  const seeSource = lang === 'zh' ? '请查阅来源页面' : 'See source page';

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
        className="max-w-5xl max-h-[90vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.full}
          alt={photo.title}
          className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
        />
        {/* Attribution block — required by CC licenses */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 max-w-2xl w-full text-white text-sm">
          <div className="space-y-1">
            <div>
              <span className="text-emerald-300 font-bold">{photoByLabel}</span>
              <span className="font-medium">{photo.author || unknownAuthor}</span>
            </div>
            {photo.license ? (
              <div>
                <span className="text-emerald-300 font-bold">{licenseLabel}</span>
                {photo.licenseUrl ? (
                  <a
                    href={photo.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline hover:text-emerald-200"
                  >
                    {photo.license}
                  </a>
                ) : (
                  <span className="font-medium">{photo.license}</span>
                )}
              </div>
            ) : (
              <div className="text-slate-300 text-xs italic">{seeSource}</div>
            )}
            <div className="pt-1">
              <a
                href={photo.descUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-300 hover:text-emerald-200 underline"
              >
                {sourceLabel} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Main component
// ============================================================
export function WikiPhotoStrip({ scientificName, lang = 'en' }) {
  const [photos, setPhotos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(null);
  const [inView, setInView] = useState(false);
  const stripRef = useRef(null);

  // Lazy-load on scroll-into-view
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
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  // Fetch when in view
  useEffect(() => {
    if (!inView || !scientificName || photos !== null) return;
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
  const sourceNote = lang === 'zh' ? '来源：维基共享 · 点击照片查看版权信息' : 'via Wikimedia Commons · tap photo for credit';
  const loadingLabel = lang === 'zh' ? '正在加载照片...' : 'Loading photos...';

  if (photos !== null && photos.length === 0 && !loading) return null;

  return (
    <div ref={stripRef} className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{heading}</span>
      </div>
      {loading && (
        <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>{loadingLabel}</span>
        </div>
      )}
      {photos && photos.length > 0 && (
        <>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setActive(p)}
                className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all relative group"
                title={p.author ? `${p.author} · ${p.license || 'See source'}` : p.title}
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
          <div className="text-[10px] text-slate-500 mt-1.5 leading-snug">
            {sourceNote}
          </div>
        </>
      )}
      {active && <PhotoLightbox photo={active} lang={lang} onClose={() => setActive(null)} />}
    </div>
  );
}
