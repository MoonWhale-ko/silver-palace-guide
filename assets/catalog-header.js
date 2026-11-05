import {mountSearch} from './search-popup.js';
export async function mountCatalogHeader(root){
 const [data,catalog]=await Promise.all([fetch(new URL('../data/home.json',import.meta.url)).then(r=>r.json()),fetch(new URL('../data/characters.json',import.meta.url)).then(r=>r.json())]);
 const goHome=term=>{location.href='./index.html?q='+encodeURIComponent(term);};
 const records=[...data.menus.map(m=>({title:m.title,description:m.description,type:'메뉴',open:()=>m.title==='캐릭터'?location.assign('./characters.html'):goHome(m.title)})),...(data.guides||[]).map(g=>({title:g.title,description:g.description,type:'가이드',open:()=>goHome(g.title)})),...catalog.characters.map(c=>({title:c.name,description:c.element+' · '+c.job,type:'캐릭터',open:()=>location.assign('./characters.html?character='+encodeURIComponent(c.id))}))];
 mountSearch(root,records);
 const toggle=root.querySelector('#header-menu-toggle'),panel=root.querySelector('#header-menu-panel'),items=panel.querySelector('.drawer-items');
 for(const title of ['캐릭터','동기','장비','이잘키','공략집','육성 계산기','입문 가이드']){
 const button=document.createElement('button');button.type='button';button.className='drawer-item';
 const icon=document.createElement('span');icon.className='drawer-icon';icon.setAttribute('aria-hidden','true');const name=title==='동기'?'motive':title==='장비'?'equipment':'character';icon.style.setProperty('--menu-icon',`url("${new URL('./menu-'+name+'.png',import.meta.url).href}")`);
 const label=document.createElement('span');label.textContent=title;button.append(icon,label);button.onclick=()=>{panel.close();if(title==='캐릭터')location.assign('./characters.html');else goHome(title);};items.append(button);}
 let overflow='';toggle.onclick=()=>{overflow=document.documentElement.style.overflow;panel.showModal();toggle.setAttribute('aria-expanded','true');document.documentElement.style.overflow='hidden';};
 panel.addEventListener('close',()=>{toggle.setAttribute('aria-expanded','false');document.documentElement.style.overflow=overflow;});
 panel.addEventListener('click',e=>{if(e.target!==panel)return;const b=panel.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)panel.close();});
}
