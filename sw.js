const VERSION = "sd-pizza-v1";
const CACHE = "cache-" + VERSION;
const ASSETS = ["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-512-maskable.png","./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if(req.method!=="GET") return;
  const url = new URL(req.url);
  if(url.origin==="https://fonts.googleapis.com" || url.origin==="https://fonts.gstatic.com"){
    e.respondWith(caches.open("fonts-"+VERSION).then(async c=>{ const hit=await c.match(req);
      const net=fetch(req).then(r=>{ if(r&&r.status===200)c.put(req,r.clone()); return r;}).catch(()=>hit);
      return hit||net; })); return;
  }
  if(url.origin===self.location.origin){
    // network-first for same-origin, fall back to cache offline
    e.respondWith(fetch(req).then(r=>{ if(r&&r.status===200&&r.type==="basic"){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));} return r; })
      .catch(()=>caches.match(req).then(c=>c||(req.mode==="navigate"?caches.match("./index.html"):undefined))));
  }
});
