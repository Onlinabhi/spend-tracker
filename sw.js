const CACHE="spend-tracker-v21";
const ASSETS=[
  "./","./index.html","./manifest.webmanifest","./css/base.css","./css/v21.css",
  "./js/fun-library.js","./js/theme-library.js","./js/app.js","./js/v21.js",
  "./icons/icon-192.svg","./icons/icon-512.svg"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match("./index.html"))));
