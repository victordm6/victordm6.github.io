/* Original page-turn implementation using CSS 3D planes. */
(() => {
 const book=document.getElementById('book'),cover=document.getElementById('cover');
 const left=document.querySelector('#paper-left .texture'),right=document.querySelector('#paper-right .texture');
 let current=0,turning=false,queued=null,finishTimer;
 function texture(node,spread,side){node.className='texture '+side+'-texture';node.style.backgroundImage=`url("/pages/${spread}.jpg")`;}
 function finish(n){clearTimeout(finishTimer);book.querySelector('.leaf')?.remove();texture(left,n,'left');texture(right,n,'right');book.classList.remove('turning');current=n;turning=false;book.dataset.spread=n;if(queued!==null){const next=queued;queued=null;change(next);}}
 function change(n){if(turning){queued=n;return;}if(n===current)return;turning=true;book.classList.add('turning');book.dataset.turning='true';
  if(current===0||n===0){texture(left,n||1,'left');texture(right,n||1,'right');book.classList.toggle('closed',n===0);book.classList.toggle('opened',n!==0);cover.style.visibility='visible';finishTimer=setTimeout(()=>{finish(n);book.dataset.turning='false';if(n>0)cover.style.visibility='hidden';},1100);return;}
  const forward=n>current,leaf=document.createElement('div');leaf.className='leaf '+(forward?'forward':'backward');
  const front=document.createElement('div'),back=document.createElement('div');front.className='leaf-face';back.className='leaf-face leaf-back';
  const a=document.createElement('div'),b=document.createElement('div');texture(a,current,forward?'right':'left');texture(b,n,forward?'left':'right');front.append(a);back.append(b);leaf.append(front,back);
  texture(forward?right:left,n,forward?'right':'left');book.append(leaf);requestAnimationFrame(()=>requestAnimationFrame(()=>leaf.classList.add('flipped')));
  finishTimer=setTimeout(()=>{finish(n);book.dataset.turning='false';},900);
 }
 window.albumBook3D={go:change,get current(){return current;},get turning(){return turning;}};
 texture(left,1,'left');texture(right,1,'right');book.dataset.spread='0';
 const heading=document.createElement('div');heading.className='cover-heading';heading.textContent='O ÁLBUM DA NOSSA HISTÓRIA';book.querySelector('.cover-front').append(heading);
 book.parentElement.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||turning)return;const r=book.parentElement.getBoundingClientRect(),x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;book.style.transform=(current===0?'translateX(-25%) ':'')+`rotateX(${5-y*6}deg) rotateY(${(current===0?-23:-3)+x*10}deg)`;});
 book.parentElement.addEventListener('pointerleave',()=>book.style.transform='');
})();
