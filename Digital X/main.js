const cur=document.getElementById('cur'),ring=document.getElementById('ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;if(cur){cur.style.left=mx+'px';cur.style.top=my+'px';}});
(function loop(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}requestAnimationFrame(loop);})();
function toggleMob(){document.getElementById('mob')?.classList.toggle('open');}
function closeMob(){document.getElementById('mob')?.classList.remove('open');}
document.addEventListener('click',e=>{const m=document.getElementById('mob'),h=document.getElementById('ham');if(m?.classList.contains('open')&&!m.contains(e.target)&&!h?.contains(e.target))m.classList.remove('open');});
const obs=new IntersectionObserver(e=>{e.forEach(el=>{if(el.isIntersecting)el.target.classList.add('in');});},{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));