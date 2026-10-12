/* Keep this saved album independent of live accounts and analytics. */
(() => {
  const nativeFetch = window.fetch.bind(window);
  const albumSlug = 'edu-ana-43e26386';
  const uploads = new Map();
  const stateKey = 'album-replica-content:'+albumSlug;
  const state = nativeFetch('/data/initial-live.json').then(r=>r.json()).then(initial=>{
    try {return JSON.parse(localStorage.getItem(stateKey)) || initial;} catch {return initial;}
  });
  const saveState = value => localStorage.setItem(stateKey,JSON.stringify(value));
  const dataURL = blob => new Promise((resolve,reject)=>{
    const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);
  });
  const localJSON = (value, status=200) => Promise.resolve(new Response(JSON.stringify(value), {
    status, headers: {'Content-Type': 'application/json'}
  }));
  const apiResult = async (url, body) => {
    let input={};
    try {input=typeof body==='string'?JSON.parse(body):(body||{});} catch {}
    if (url.pathname.includes('/album-live/')) {
      const content=await state;
      if (url.pathname.endsWith('/prepare')) {
        const key=crypto.randomUUID();
        return {key,uploadUrl:location.origin+'/replica-upload/'+key,cacheControl:'no-store'};
      }
      if (url.pathname.endsWith('/destinos')) {
        content.destinos={...content.destinos,items:input.items};saveState(content);
        return {destinos:content.destinos};
      }
      const section=content[input.section] || (content[input.section]={photos:{}});
      const photos=section.photos || (section.photos={});
      if(url.pathname.endsWith('/remove'))photos[input.slot]=null;
      if(url.pathname.endsWith('/commit'))photos[input.slot]=uploads.get(input.key);
      saveState(content);
      return {url:photos[input.slot],photos};
    }
    if (url.pathname.includes('/starmap/chart')) return nativeFetch('/data/starmap.json').then(r=>r.json());
    if (url.pathname.includes('/tracking/config')) return Promise.resolve({enabled:false,facebook:{enabled:false},tiktok:{enabled:false}});
    if (url.pathname.includes('/auth/csrf-token')) return Promise.resolve({csrfToken:'local-replica'});
    if (/album-(textures|frames)\/prepare/.test(url.pathname)) return Promise.resolve({uploads:[],textures:[],frames:[],items:[]});
    if (url.pathname.includes('/geo')) return Promise.resolve({country:'BR',countryCode:'BR'});
    return Promise.resolve({success:true});
  };
  window.__ALBUM_LOCAL_REQUEST__ = (url, body) => apiResult(new URL(url, location.origin), body);
  window.__ALBUM_LOCAL_REQUEST__ = (url, body) => apiResult(new URL(url, location.origin), body);
  window.fetch = (input, init={}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if(url.pathname.startsWith('/replica-upload/')) {
      return dataURL(init.body).then(value=>{uploads.set(url.pathname.split('/').at(-1),value);return new Response('',{status:200});});
    }
    if (/facebook|tiktok|google-analytics|googletagmanager|cloudflarestorage|pinterest/.test(url.hostname)) return localJSON({});
    if (url.hostname === 'api.lovepanda.com.br' || url.pathname.startsWith('/api/')) {
      if (url.pathname.includes('/starmap/chart')) return nativeFetch('/data/starmap.json');
      if (url.pathname.includes('/tracking/config')) return localJSON({enabled:false,facebook:{enabled:false},tiktok:{enabled:false}});
      if (url.pathname.includes('/auth/csrf-token')) return localJSON({csrfToken:'local-replica'});
      if (url.pathname.includes('/album-textures/prepare')) return localJSON({uploads:[],textures:[]});
      if (url.pathname.includes('/geo')) return localJSON({country:'BR',countryCode:'BR'});
      return localJSON({success:true});
    }
    if (url.hostname === 'media.lovepanda.com.br') return nativeFetch('/assets/media.lovepanda.com.br'+url.pathname+url.search,init);
    if (url.hostname === 'lovepanda.com.br' && !url.pathname.startsWith('/presente/')) return nativeFetch(url.pathname+url.search,init);
    return nativeFetch(input,init);
  };
  const OriginalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = class ReplicaXHR extends OriginalXHR {
    open(method,url,...options) {
      const parsed=new URL(url,location.href);
      this.__replicaURL=parsed;
      this.__replicaLocal=parsed.hostname==='api.lovepanda.com.br'||parsed.pathname.startsWith('/api/')||/facebook|tiktok|pinterest|google-analytics/.test(parsed.hostname);
      return super.open(method,this.__replicaLocal?'/data/starmap.json':url,...options);
    }
    send(body) {
      if (!this.__replicaLocal) return super.send(body);
      this.__replicaAborted=false;
      apiResult(this.__replicaURL,body).then(value=>{
        if(this.__replicaAborted)return;
        const text=JSON.stringify(value);
        for(const [key,value] of Object.entries({readyState:4,status:200,statusText:'OK',responseText:text,response:this.responseType==='json'?value:text,responseURL:this.__replicaURL.href})) {
          Object.defineProperty(this,key,{configurable:true,get:()=>value});
        }
        this.getAllResponseHeaders=()=> 'content-type: application/json\r\n';
        this.getResponseHeader=name=>name.toLowerCase()==='content-type'?'application/json':null;
        this.dispatchEvent(new Event('readystatechange'));
        this.dispatchEvent(new Event('load'));
        this.dispatchEvent(new Event('loadend'));
      }).catch(()=>{this.dispatchEvent(new Event('error'));this.dispatchEvent(new Event('loadend'));});
    }
    abort(){this.__replicaAborted=true;return super.abort();}
  };
  // Do not send replicas' visits to the original owner.
  if (navigator.sendBeacon) navigator.sendBeacon = () => true;
  window.__ALBUM_REPLICA__ = {albumSlug,local:true};
})();
