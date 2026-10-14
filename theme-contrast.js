/* Keep the yellow/red theme readable on both paper and dark interactive pages. */
(()=>{
 const parse=s=>{if(/^#[\da-f]{6}$/i.test(s||''))return {rgb:s.slice(1).match(/../g).map(x=>parseInt(x,16)),alpha:1};const m=s?.match(/^rgba?\(([^)]+)\)/);if(!m)return null;const a=m[1].split(/[, /]+/).map(Number);return {rgb:a.slice(0,3),alpha:a[3]??1};};
 const luminance=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 const ink=[101,9,18],light=[255,241,174];let pending=false;
 function update(){pending=false;for(const el of document.querySelectorAll('body *')){
  if(!(el instanceof HTMLElement)||!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;
  const text=parse(getComputedStyle(el).color);if(!text)continue;let bg=null;
  for(let node=el;node;node=node.parentElement){const surface=parse(node.dataset.themeSurface);if(surface){bg=surface.rgb;break;}const style=getComputedStyle(node),color=parse(style.backgroundColor);if(color&&color.alpha>.85){bg=color.rgb;break;}const grad=style.backgroundImage?.match(/(?:linear|radial)-gradient\([^]*?(rgba?\([^)]+\))/);if(grad){const g=parse(grad[1]);if(g?.alpha>.85){bg=g.rgb;break;}}}
  if(!bg)continue;const composite=text.rgb.map((c,i)=>c*text.alpha+bg[i]*(1-text.alpha));if(ratio(composite,bg)>=4.5)continue;
  const next=ratio(ink,bg)>ratio(light,bg)?ink:light;el.style.color=`rgb(${next.join(',')})`;
 }}
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update);}};
 new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,characterData:true});schedule();
})();
