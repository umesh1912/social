// Web map: Leaflet + OpenStreetMap tiles, exactly as in the prototype.
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { View } from 'react-native';
import { CENTER, firstName } from '../../data';
import { slate, type Grad } from '../../theme';
import { fill } from '../ui';
import { findLL, SEL_OFFSET, type NearbyMapProps } from './types';

type LeafletNS = any;
declare global {
  interface Window { L?: LeafletNS }
}

const CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const CSS_SRI = 'sha384-sHL9NAb7lN7rfvG5lfHpm643Xkcjzp4jFvuavGOndn6pjVqS6ny56CAt3nsEVT4H';
const JS_SRI = 'sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH';
const EXTRA_CSS = `.duo-map.leaflet-container{font-family:inherit;background:${slate[200]}}.duo-map .leaflet-tile-pane{filter:saturate(.4) brightness(1.04)}.duo-map .leaflet-control-attribution{font-size:9px!important;border-radius:6px 0 0 0}
@keyframes duoPulse{0%{box-shadow:0 0 0 0 var(--c)}70%{box-shadow:0 0 0 22px transparent}100%{box-shadow:0 0 0 0 transparent}}`;

let loading: Promise<LeafletNS> | null = null;
function loadLeaflet(): Promise<LeafletNS> {
  if (window.L) return Promise.resolve(window.L);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const css = document.createElement('link');
    Object.assign(css, { rel: 'stylesheet', href: CSS_URL, integrity: CSS_SRI, crossOrigin: 'anonymous' });
    const style = document.createElement('style');
    style.textContent = EXTRA_CSS;
    const js = document.createElement('script');
    Object.assign(js, { src: JS_URL, integrity: JS_SRI, crossOrigin: 'anonymous', onload: () => resolve(window.L), onerror: reject });
    document.head.append(css, style, js);
  }).catch(e => {
    loading = null; // let the next mount retry, e.g. after the network comes back
    throw e;
  });
  return loading;
}

const cssGrad = (g: Grad) =>
  `linear-gradient(${g.angle}deg,${g.colors.map((c, i) => `${c} ${Math.round((g.locations?.[i] ?? i / (g.colors.length - 1)) * 100)}%`).join(',')})`;
const esc = (t: string) => t.replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch] as string);
const label = (t: string) =>
  `<div style="position:absolute;left:50%;top:100%;margin-top:4px;transform:translateX(-50%);background:#fff;border-radius:40px;padding:2px 8px;font:700 10px 'PlusJakartaSans_700Bold','Plus Jakarta Sans',sans-serif;color:${slate[900]};white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.18)">${esc(t)}</div>`;

export default function NearbyMap(p: NearbyMapProps) {
  const host = useRef<View>(null);
  const map = useRef<any>(null);
  const layer = useRef<any>(null);
  const props = useRef(p);
  useLayoutEffect(() => {
    props.current = p;
  });

  const draw = () => {
    const L = window.L, m = map.current;
    if (!L || !m) return;
    const { theme: T, visible: vis, filter, people, meets, selected, onSelect } = props.current;
    const grad = cssGrad(T.grad);
    layer.current.clearLayers();
    L.circle(CENTER, { radius: 650, color: T.accent, weight: 1.5, opacity: 0.5, fillColor: T.accent, fillOpacity: 0.07, dashArray: '4 6', interactive: false }).addTo(layer.current);
    L.marker(CENTER, {
      interactive: false, zIndexOffset: 1000,
      icon: L.divIcon({ className: '', iconSize: [22, 22], iconAnchor: [11, 11], html: `<div style="width:22px;height:22px;border-radius:96px;background:${vis ? T.accent : slate[400]};border:4px solid #fff;box-sizing:border-box;--c:${T.shadow};animation:${vis ? 'duoPulse 2s infinite' : 'none'};box-shadow:0 2px 6px rgba(0,0,0,.2)"></div>` }),
    }).addTo(layer.current);
    if (filter === 'people') {
      people.forEach(x => {
        const sel = selected === x.id, z = sel ? 60 : 50;
        const html = `<div style="position:relative;width:${z}px;height:${z}px;border-radius:96px;padding:3px;box-sizing:border-box;background:${grad};box-shadow:0 6px 14px ${T.shadow};transition:all .2s"><img src="${x.src}" style="width:100%;height:100%;border-radius:96px;object-fit:cover;border:2px solid #fff;display:block;box-sizing:border-box">${x.waved ? `<div style="position:absolute;top:-4px;right:-4px;background:#fff;color:${T.accent};border-radius:40px;padding:1px 6px;font:800 9px sans-serif;box-shadow:0 1px 3px rgba(0,0,0,.2)">HI</div>` : ''}${label(firstName(x.name))}</div>`;
        L.marker(x.ll, { zIndexOffset: sel ? 900 : 0, icon: L.divIcon({ className: '', html, iconSize: [z, z], iconAnchor: [z / 2, z / 2] }) }).on('click', () => onSelect(x.id)).addTo(layer.current);
      });
    } else {
      meets.forEach(x => {
        const sel = selected === x.id, z = sel ? 56 : 48;
        const html = `<div style="position:relative;width:${z}px;height:${z}px;border-radius:16px;background:${grad};color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 6px 14px ${T.shadow};border:3px solid #fff;box-sizing:border-box;font:800 12px 'PlusJakartaSans_800ExtraBold','Plus Jakarta Sans',sans-serif;line-height:1">${esc(x.time)}<span style="font-size:9px;font-weight:600;opacity:.85;margin-top:2px">${x.goingN} going</span>${label(x.title)}</div>`;
        L.marker(x.ll, { zIndexOffset: sel ? 900 : 0, icon: L.divIcon({ className: '', html, iconSize: [z, z], iconAnchor: [z / 2, z / 2] }) }).on('click', () => onSelect(x.id)).addTo(layer.current);
      });
    }
  };

  useEffect(() => {
    let cancelled = false;
    const el = host.current as unknown as HTMLElement;
    loadLeaflet().then(L => {
      if (cancelled || !el) return;
      el.classList.add('duo-map');
      map.current = L.map(el, { zoomControl: false }).setView(CENTER, 15);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 19 }).addTo(map.current);
      layer.current = L.layerGroup().addTo(map.current);
      draw();
      setTimeout(() => map.current?.invalidateSize(), 250);
    }).catch(() => {
      // Offline or blocked CDN: leave the plain backdrop; pins and cards still work.
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const pinKey = JSON.stringify([p.theme.accent, p.visible, p.filter, p.selected, p.people.map(x => x.waved), p.meets.map(x => x.id + x.goingN)]);
  useEffect(draw, [pinKey]);

  useEffect(() => {
    const ll = findLL(p, p.selected);
    if (ll && map.current) map.current.flyTo([ll[0] - SEL_OFFSET, ll[1]], 16, { duration: 0.5 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.selected]);
  useEffect(() => {
    if (p.recenterKey && map.current) map.current.flyTo(CENTER, 15, { duration: 0.5 });
  }, [p.recenterKey]);

  return <View ref={host} style={fill} />;
}
