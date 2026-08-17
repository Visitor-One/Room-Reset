const items=[
 {id:"shirt",img:"item-shirt.png",x:.72,y:.77,w:.105,target:"waesche"},
 {id:"socke",img:"item-socke.png",x:.54,y:.79,w:.065,target:"waesche"},
 {id:"buch",img:"item-buch.png",x:.36,y:.82,w:.095,target:"regal"},
 {id:"kopfhoerer",img:"item-kopfhoerer.png",x:.47,y:.75,w:.09,target:"schreibtisch"},
 {id:"becher",img:"item-becher.png",x:.63,y:.70,w:.07,target:"schreibtisch"},
 {id:"papier",img:"item-papier.png",x:.42,y:.70,w:.075,target:"papierkorb"},
 {id:"stifte",img:"item-stifte.png",x:.67,y:.73,w:.075,target:"schreibtisch"},
 {id:"hoodie",img:"item-hoodie.png",x:.79,y:.79,w:.12,target:"waesche"}
];
// Coordinates are relative to the visible room image, so the whole scene always fits on screen.
const targets={
 waesche:{x:.88,y:.69,w:.16,h:.28},
 regal:{x:.69,y:.36,w:.16,h:.45},
 schreibtisch:{x:.53,y:.47,w:.28,h:.17},
 papierkorb:{x:.66,y:.60,w:.10,h:.20}
};
const stage=document.querySelector("#stage"), room=document.querySelector("#room"), field=document.querySelector("#playfield");
let solved=0;

function layout(){
 const sr=stage.getBoundingClientRect(), rr=room.getBoundingClientRect();
 field.style.left=(rr.left-sr.left)+"px"; field.style.top=(rr.top-sr.top)+"px";
 field.style.width=rr.width+"px"; field.style.height=rr.height+"px";
 document.querySelectorAll(".item").forEach(el=>{
   const d=items.find(i=>i.id===el.dataset.id);
   if(!el.dataset.done){el.style.left=(d.x*100)+"%";el.style.top=(d.y*100)+"%"}
   el.style.width=(d.w*100)+"%";
 });
}
function make(){
 Object.entries(targets).forEach(([id,z])=>{
   const el=document.createElement("div");el.className="zone";el.dataset.id=id;
   Object.assign(el.style,{left:z.x*100+"%",top:z.y*100+"%",width:z.w*100+"%",height:z.h*100+"%"});field.append(el);
 });
 items.forEach(d=>{
   const el=document.createElement("img");el.src=d.img;el.className="item";el.dataset.id=d.id;el.alt=d.id;
   el.style.left=d.x*100+"%";el.style.top=d.y*100+"%";el.style.width=d.w*100+"%";field.append(el);drag(el,d);
 });
 layout();
}
function zoneAt(px,py,id){
 const z=targets[id], r=field.getBoundingClientRect(), x=(px-r.left)/r.width, y=(py-r.top)/r.height;
 return x>z.x-z.w/2&&x<z.x+z.w/2&&y>z.y-z.h/2&&y<z.y+z.h/2;
}
function drag(el,d){
 let pid;
 el.addEventListener("pointerdown",e=>{if(el.dataset.done)return;pid=e.pointerId;el.setPointerCapture(pid);el.classList.add("drag")});
 el.addEventListener("pointermove",e=>{
  if(pid!==e.pointerId)return;const r=field.getBoundingClientRect();
  el.style.left=((e.clientX-r.left)/r.width*100)+"%";el.style.top=((e.clientY-r.top)/r.height*100)+"%";
  document.querySelectorAll(".zone").forEach(z=>z.classList.toggle("hot",z.dataset.id===d.target&&zoneAt(e.clientX,e.clientY,d.target)));
 });
 el.addEventListener("pointerup",e=>{
  if(pid!==e.pointerId)return;pid=null;el.classList.remove("drag");document.querySelectorAll(".zone").forEach(z=>z.classList.remove("hot"));
  if(zoneAt(e.clientX,e.clientY,d.target)){
    const z=targets[d.target];el.style.left=z.x*100+"%";el.style.top=z.y*100+"%";el.style.opacity="0";el.style.pointerEvents="none";el.dataset.done="1";
    solved++;document.querySelector("#progress").textContent=solved+" / "+items.length;
    if(solved===items.length)setTimeout(()=>document.querySelector("#finish").style.display="flex",300);
  } else {el.style.left=d.x*100+"%";el.style.top=d.y*100+"%"}
 });
}
room.addEventListener("load",()=>{make()}); window.addEventListener("resize",layout);
if(room.complete) make();