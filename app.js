const nav=document.querySelector("nav");
addEventListener("scroll",()=>nav?.classList.toggle("scrolled",scrollY>18));
addEventListener("pageshow",()=>document.body.classList.remove("leaving"));

const menu=document.querySelector(".menu");
const links=document.querySelector(".nav-links");
menu?.addEventListener("click",()=>links?.classList.toggle("open"));
links?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));

const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add("show");reveal.unobserve(entry.target)}
}),{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>reveal.observe(el));

document.querySelectorAll("a[data-transition]").forEach(link=>link.addEventListener("click",event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||link.target==="_blank")return;
  event.preventDefault();
  document.body.classList.add("leaving");
  setTimeout(()=>location.href=link.href,125);
}));

const internalPages=["index.html","projects.html","lab.html","about.html","contact.html"];
const prefetchPages=()=>internalPages.forEach(page=>{
  if(location.pathname.endsWith(page))return;
  const hint=document.createElement("link");
  hint.rel="prefetch";
  hint.href=page;
  document.head.appendChild(hint);
});
if("requestIdleCallback" in window)requestIdleCallback(prefetchPages,{timeout:900});
else setTimeout(prefetchPages,300);

document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(item=>item.classList.remove("active"));
  button.classList.add("active");
  const filter=button.dataset.filter;
  document.querySelectorAll(".project").forEach(card=>{
    const visible=filter==="all"||card.dataset.cat===filter;
    card.style.display=visible?"flex":"none";
    if(visible)requestAnimationFrame(()=>card.classList.add("show"));
  });
}));

const modal=document.querySelector(".modal");
const modalImage=modal?.querySelector("img");
document.querySelectorAll("[data-modal-image]").forEach(button=>button.addEventListener("click",()=>{
  modalImage.src=button.dataset.modalImage;
  modalImage.alt=button.dataset.modalAlt||"Project map layout";
  modal.classList.add("open");
  document.body.style.overflow="hidden";
}));
function closeModal(){modal?.classList.remove("open");document.body.style.overflow=""}
modal?.querySelector(".modal-close")?.addEventListener("click",closeModal);
modal?.addEventListener("click",event=>{if(event.target===modal)closeModal()});
addEventListener("keydown",event=>{if(event.key==="Escape")closeModal()});

document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
