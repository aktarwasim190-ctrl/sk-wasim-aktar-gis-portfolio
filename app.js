const nav=document.querySelector('nav');
let scrollQueued=false;
addEventListener('scroll',()=>{
  if(scrollQueued)return;
  scrollQueued=true;
  requestAnimationFrame(()=>{nav?.classList.toggle('scrolled',scrollY>18);scrollQueued=false});
},{passive:true});
addEventListener('pageshow',()=>document.body.classList.remove('leaving'));

const menu=document.querySelector('.menu');
const links=document.querySelector('.nav-links');
menu?.setAttribute('aria-expanded','false');
menu?.addEventListener('click',()=>{
  const open=links?.classList.toggle('open')||false;
  menu.setAttribute('aria-expanded',String(open));
});
links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  links.classList.remove('open');menu?.setAttribute('aria-expanded','false');
}));

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const compact=matchMedia('(max-width: 700px), (pointer: coarse)').matches;
const reveals=[...document.querySelectorAll('.reveal')];
if(!reduced && 'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target)}
  }),{rootMargin:'0px 0px 90px 0px',threshold:.01});
  reveals.forEach(el=>observer.observe(el));
}else reveals.forEach(el=>el.classList.add('show'));

document.querySelectorAll('a[data-transition]').forEach(link=>link.addEventListener('click',event=>{
  if(event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||
    event.button!==0||link.target==='_blank'||link.origin!==location.origin||
    link.pathname===location.pathname)return;
  if(compact||reduced)return;
  event.preventDefault();
  document.body.classList.add('leaving');
  setTimeout(()=>location.assign(link.href),150);
}));

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(item=>item.classList.remove('active'));
  button.classList.add('active');
  const filter=button.dataset.filter;
  document.querySelectorAll('.project').forEach(card=>{
    const visible=filter==='all'||card.dataset.cat===filter;
    card.hidden=!visible;
    if(visible)card.classList.add('show');
  });
}));

// Pointer tilt is active only on desktop, and only for the hovered card.
if(!compact&&!reduced&&matchMedia('(hover: hover) and (pointer: fine)').matches){
  document.querySelectorAll('[data-parallax]').forEach(card=>{
    let frame=0;
    card.addEventListener('pointermove',event=>{
      if(frame)return;
      frame=requestAnimationFrame(()=>{
        const box=card.getBoundingClientRect();
        const x=(event.clientX-box.left)/box.width-.5;
        const y=(event.clientY-box.top)/box.height-.5;
        card.style.setProperty('--rx',(-y*4).toFixed(2)+'deg');
        card.style.setProperty('--ry',(x*5).toFixed(2)+'deg');
        frame=0;
      });
    },{passive:true});
    card.addEventListener('pointerleave',()=>{
      if(frame)cancelAnimationFrame(frame);
      frame=0;
      card.style.removeProperty('--rx');card.style.removeProperty('--ry');
    });
  });
}

const modal=document.querySelector('.modal');
const modalImage=modal?.querySelector('img');
document.querySelectorAll('[data-modal-image]').forEach(button=>button.addEventListener('click',()=>{
  modalImage.src=button.dataset.modalImage;
  modalImage.alt=button.dataset.modalAlt||'Project map layout';
  modal.classList.add('open');
  document.body.style.overflow='hidden';
  modal.querySelector('.modal-close')?.focus();
}));
function closeModal(){modal?.classList.remove('open');document.body.style.overflow=''}
modal?.querySelector('.modal-close')?.addEventListener('click',closeModal);
modal?.addEventListener('click',event=>{if(event.target===modal)closeModal()});
addEventListener('keydown',event=>{if(event.key==='Escape')closeModal()});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
