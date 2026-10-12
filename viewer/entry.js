(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push([document.currentScript,990001,e=>{
  const React=e.i(271645),DOM=e.r(88014),Viewer=e.i(413019).default,Provider=e.i(755287).I18nProvider;
  Promise.all([fetch('/data/album.json?v=victor-maria').then(r=>r.json()),fetch('/data/viewer-labels.json').then(r=>r.json())]).then(async ([album,messages])=>{
    const requests=new Set(Array.from(document.fonts,face=>`${face.style} 500 36px ${face.family}`));
    await Promise.all(Array.from(requests,font=>document.fonts.load(font,'Victor & Maria Eduarda 2026').catch(()=>{})));
    function App(){const[open,setOpen]=React.useState(false);return React.createElement(Provider,{locale:'pt',messages,hostname:location.hostname},open?React.createElement(Viewer,{...album,visible:true}):React.createElement('main',{id:'intro'},React.createElement('img',{src:album.sources[0].src,alt:'O álbum de Victor e Maria Eduarda'}),React.createElement('p',{},'Para Maria Eduarda'),React.createElement('h1',{},'Victor guardou a história de vocês em um álbum.'),React.createElement('p',{},'30 páginas · 41 fotos · 973 dias de história'),React.createElement('button',{onClick:()=>setOpen(true)},'Abrir o álbum')));}
    DOM.createRoot(document.getElementById('album-root')).render(React.createElement(App));
  }).catch(error=>{document.getElementById('album-root').textContent='Não foi possível abrir o álbum.';console.error(error);});
}]);
TURBOPACK.push([document.currentScript,{otherChunks:[],runtimeModuleIds:[990001]}]);
