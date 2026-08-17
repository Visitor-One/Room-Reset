// Positionen in Prozent bezogen auf das generierte 1536x1024-Levelbild.
const objects=[
 {name:'Shirt',x:65.7,y:54.4,w:11.3,h:7.7,target:'laundry'},
 {name:'Socke',x:51.5,y:67.3,w:7.0,h:7.6,target:'laundry'},
 {name:'Buch',x:20.5,y:72.4,w:8.6,h:6.7,target:'shelf'},
 {name:'Kopfhörer',x:43.2,y:65.0,w:8.1,h:8.0,target:'desk'},
 {name:'Papierknäuel',x:35.5,y:63.0,w:6.3,h:8.0,target:'trash'},
 {name:'Hoodie',x:63.0,y:64.8,w:15.0,h:12.8,target:'laundry'},
 {name:'Rucksack',x:53.5,y:55.0,w:14.0,h:11.5,target:'wardrobe'},
 {name:'Skateboard',x:88.0,y:38.0,w:8.5,h:39.5,target:'wardrobe'}
];
const targets={
 laundry:{x:76.0,y:52.5,w:13.5,h:21.5,label:'Wäschekorb'},
 shelf:{x:61.5,y:7.5,w:14.5,h:42,label:'Regal'},
 desk:{x:31.0,y:29.5,w:29,h:24,label:'Schreibtisch'},
 trash:{x:55.0,y:44.0,w:7.5,h:14,label:'Papierkorb'},
 wardrobe:{x:76.0,y:5.0,w:18.0,h:48,label:'Schrank'}
};
const stage=document.querySelector('#stage'),msg=document.querySelector('#msg'),score=document.querySelector('#score');let solved=0,active=null;
function box(el,o){Object.assign(el.style,{left:o.x+'%',top:o.y+'%',width:o.w+'%',height:o.h+'%'})}
Object.entries(targets).forEach(([id,o])=>{let e=document.createElement('div');e.className='target';e.dataset.id=id;box(e,o);stage.appendChild(e)});
objects.forEach((o,i)=>{let e=document.createElement('div');e.className='hotspot';e.dataset.i=i;e.setAttribute('aria-label',o.name);box(e,o);stage.appendChild(e);let sx,sy,sl,st;
 e.addEventListener('pointerdown',ev=>{active=e;e.setPointerCapture(ev.pointerId);let r=e.getBoundingClientRect(),g=document.querySelector('#game').getBoundingClientRect();sx=ev.clientX;sy=ev.clientY;sl=r.left-g.left;st=r.top-g.top;e.classList.add('drag');msg.textContent=o.name+' → wohin gehört das?'});
 e.addEventListener('pointermove',ev=>{if(active!==e)return;let g=document.querySelector('#game').getBoundingClientRect();e.style.left=(sl+ev.clientX-sx)/g.width*100+'%';e.style.top=(st+ev.clientY-sy)/g.height*100+'%';document.querySelectorAll('.target').forEach(t=>t.classList.toggle('hot',inside(ev.clientX,ev.clientY,t)&&t.dataset.id===o.target))});
 e.addEventListener('pointerup',ev=>{if(active!==e)return;let good=[...document.querySelectorAll('.target')].find(t=>t.dataset.id===o.target&&inside(ev.clientX,ev.clientY,t));document.querySelectorAll('.target').forEach(t=>t.classList.remove('hot'));e.classList.remove('drag');if(good){e.remove();solved++;score.textContent=solved;msg.textContent='✓ '+o.name+' richtig aufgeräumt';if(solved===objects.length)setTimeout(()=>document.querySelector('#done').style.display='flex',300)}else{box(e,o);msg.textContent='Das ist noch nicht der richtige Platz für '+o.name+'.'}active=null})
});
function inside(x,y,e){let r=e.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom}
document.querySelector('#help').onclick=()=>{document.querySelectorAll('.hotspot').forEach(e=>e.classList.add('ready'));document.querySelectorAll('.target').forEach(e=>e.classList.add('hot'));msg.textContent='Gelb = Gegenstände · Grün = mögliche Ablagebereiche';setTimeout(()=>{document.querySelectorAll('.hotspot').forEach(e=>e.classList.remove('ready'));document.querySelectorAll('.target').forEach(e=>e.classList.remove('hot'))},1800)};
