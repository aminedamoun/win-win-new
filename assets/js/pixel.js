/**
 * pixel.js — Meta (Facebook) Pixel + traffic-source capture.
 * Loaded on every funnel page (homepage, careers, job detail, application, booking).
 *
 * - Initializes the Meta Pixel and tracks PageView (only if a Pixel ID is configured).
 * - Captures the first-seen traffic source (?vir= or ?utm_source=) into sessionStorage
 *   so the application form can record it as `vir_prijave` (e.g. "meta").
 *
 * Set the Pixel ID via VITE_META_PIXEL_ID (build env) or in assets/js/config.js → meta.pixelId.
 */
import { CONFIG } from './config.js';

// --- Capture traffic source on first page of the visit (Meta → /zaposlitve/ → ... → /prijava/) ---
try {
  const params = new URLSearchParams(window.location.search);
  const vir = params.get('vir') || params.get('utm_source');
  if (vir && !sessionStorage.getItem('vir_prijave')) {
    sessionStorage.setItem('vir_prijave', vir);
  }
} catch (_) { /* sessionStorage may be unavailable; non-fatal */ }

// --- Meta Pixel base code (loads only when an ID is configured) ---
const PIXEL_ID = CONFIG.meta && CONFIG.meta.pixelId;
if (PIXEL_ID) {
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
}
