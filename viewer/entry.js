(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push([document.currentScript,439805,(e,module)=>{module.exports=function(value){return this.__data__.has(value)};}]);
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push([document.currentScript,990001,e=>{
  const React=e.i(271645),DOM=e.r(88014),Viewer=e.i(413019).default,Provider=e.i(755287).I18nProvider;
  Promise.all([fetch('/data/album.json?v=novas-capas').then(r=>r.json()),fetch('/data/viewer-labels.json?v=journal-layout').then(r=>r.json())]).then(async ([album,messages])=>{
    const startPage=album.sources.find(source=>source.live?.kind==='timeTogether').live;
    const startedAt=new Date(startPage.date+'T'+(startPage.time||'12:00')+':00-03:00');
    const elapsedDays=Math.max(0,Math.floor((Date.now()-startedAt.getTime())/86400000));
    for(const source of album.sources){if(source.live&&'totalDays' in source.live)source.live.totalDays=elapsedDays;}
    album.endFiller.totalDays=elapsedDays;
    const milestones=album.sources.find(source=>source.live?.kind==='conquistas').live;
    const anniversary=years=>{const date=new Date(startedAt);date.setFullYear(date.getFullYear()+years);return date.getTime();};
    const halfYear=new Date(startedAt);halfYear.setMonth(halfYear.getMonth()+6);
    const thresholds={year1:anniversary(1),years2:anniversary(2),days500:startedAt.getTime()+500*86400000,days100:startedAt.getTime()+100*86400000,months6:halfYear.getTime(),spark:startedAt.getTime()+7*86400000,month1:startedAt.getTime()+30*86400000};
    const badgeLabels=Object.fromEntries(milestones.cards.map(card=>[card.id,{label:card.label,name:card.label,description:card.description}]));
    messages.giftPages={timeTogether:{achievements:{badges:badgeLabels}}};
    milestones.cards=milestones.cards.filter(card=>!(card.id in thresholds)||Date.now()>=thresholds[card.id]);
    const achievementDefinitions=e.i(883815).computeAchievements({totalDays:elapsedDays,startDate:startPage.date,photoCount:64,totalPhotoCount:64,messageLength:300,musicTitle:'O CÉU EXPLICA TUDO',timelineCount:6,worldMapCount:4,galleryCount:12,rouletteCount:9,hasWordle:false,hasStarMap:true,hasChristmas:false,hasWrapped:false,hasCustomQR:false,sectionsCount:30,visitCount:0},false);
    const achievementIcons=new Map(achievementDefinitions.map(item=>[item.id,item.IconComponent]));
    milestones.cards=milestones.cards.map(card=>{const Icon=achievementIcons.get(card.id);if(!Icon)throw new Error('Ícone de conquista ausente: '+card.id);return {...card,Icon};});
    milestones.unlockedCount=milestones.cards.length;
    const requests=new Set(Array.from(document.fonts,face=>`${face.style} 500 36px ${face.family}`));
    await Promise.all(Array.from(requests,font=>document.fonts.load(font,'Victor & Maria Eduarda 2026').catch(()=>{})));
    function App(){const[open,setOpen]=React.useState(false);return React.createElement(Provider,{locale:'pt',messages,hostname:location.hostname},open?React.createElement(Viewer,{...album,visible:true}):React.createElement('main',{id:'intro'},React.createElement('img',{src:album.sources[0].src,alt:'O álbum de Victor e Maria Eduarda'}),React.createElement('p',{},'Para Maria Eduarda'),React.createElement('h1',{},'Victor guardou a história de vocês em um álbum.'),React.createElement('p',{},`30 páginas · 64 fotos · ${elapsedDays} dias de história`),React.createElement('button',{onClick:()=>setOpen(true)},'Abrir o álbum')));}
    DOM.createRoot(document.getElementById('album-root')).render(React.createElement(App));
  }).catch(error=>{document.getElementById('album-root').textContent='Não foi possível abrir o álbum.';console.error(error);});
}]);
TURBOPACK.push([document.currentScript,{otherChunks:[],runtimeModuleIds:[990001]}]);

