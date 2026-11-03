import {mountSearch} from './search-popup.js';
export function mount(data){
 const root=document.getElementById('ss-blue-silver'),dialog=root.querySelector('#b-dialog'),input=root.querySelector('#b-search');
 const heading=root.querySelector('h1'),logo=heading.querySelector('img');if(logo)logo.alt=data.heading;else heading.textContent=data.heading;root.querySelector('.b-intro').textContent=data.description;
 root.querySelector('#beginner-heading').textContent=data.beginnerTitle;root.querySelector('#beginner-description').textContent=data.beginnerDescription;
 const beginnerEntry=root.querySelector('.welcome-link');
 function revealBeginner(){show('입문 가이드',['입문 가이드는 아직 준비 중입니다.']);}
 root.querySelector('.welcome-link').onclick=e=>{e.preventDefault();revealBeginner();};
 const theme=root.querySelector('#b-theme');let dark=matchMedia('(prefers-color-scheme:dark)').matches;
 try{const saved=localStorage.getItem('sp-guide-theme');if(saved)dark=saved==='dark';}catch{}
 function paint(){root.dataset.theme=dark?'dark':'light';document.documentElement.style.colorScheme=dark?'dark':'light';if(theme){theme.textContent=dark?'라이트 모드':'다크 모드';theme.setAttribute('aria-pressed',String(dark));}}
 if(theme)theme.onclick=()=>{dark=!dark;paint();try{localStorage.setItem('sp-guide-theme',dark?'dark':'light');}catch{}};paint();
 function show(title,paragraphs,status='준비 중'){
  root.querySelector('#dialog-title').textContent=title;root.querySelector('#dialog-status').textContent=status;
  const body=root.querySelector('#dialog-content');body.replaceChildren();paragraphs.forEach(text=>{const p=document.createElement('p');p.textContent=text;body.append(p);});if(!dialog.open)dialog.showModal();
 }
 function openMenu(menu){if(menu.url){location.assign(menu.url);return;}show(menu.title,[menu.description+'에 관한 자료를 모을 예정입니다.','현재는 홈 화면을 먼저 구성하고 있습니다. 자료가 준비되면 이 메뉴에서 바로 볼 수 있도록 연결하겠습니다.']);}
 const menus=root.querySelector('.main-menus');menus.replaceChildren();
 data.menus.forEach(menu=>{const button=document.createElement('button');button.type='button';button.className='menu';const icon=document.createElement('span');icon.className='menu-icon';icon.setAttribute('aria-hidden','true');const iconName=menu.title==='동기'?'motive':menu.title==='장비'?'equipment':'character';icon.style.setProperty('--menu-icon',`url("${new URL(`./menu-${iconName}.png`,import.meta.url).href}")`);const title=document.createElement('span');title.className='menu-title';title.textContent=menu.title;const description=document.createElement('span');description.className='menu-description';description.textContent=menu.description;const bottom=document.createElement('span');bottom.className='menu-bottom';const status=document.createElement('span');status.textContent=menu.url?'자료 보기':'준비 중';const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');bottom.append(status,arrow);button.append(icon,title,description,bottom);button.onclick=()=>openMenu(menu);menus.append(button);});
 const guides=data.guides||[],guideList=root.querySelector('.guide-list');guideList.replaceChildren();
 function openGuide(guide){show(guide.title,guide.paragraphs,'입문 가이드 · 초안');}
 guides.forEach(guide=>{const button=document.createElement('button');button.type='button';button.className='guide-row';const category=document.createElement('span');category.className='guide-category';category.textContent=guide.category;const body=document.createElement('span'),title=document.createElement('strong'),description=document.createElement('span'),arrow=document.createElement('span');title.className='guide-title';title.textContent=guide.title;description.className='guide-description';description.textContent=guide.description;body.append(title,description);arrow.className='guide-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');button.append(category,body,arrow);button.onclick=()=>openGuide(guide);guideList.append(button);});
 const records=[...data.menus.map(menu=>({title:menu.title,description:menu.description,type:'메뉴',open:()=>openMenu(menu)})),...guides.map(guide=>({title:guide.title,description:guide.description,type:'가이드',open:()=>openGuide(guide)}))];

 const menuToggle=root.querySelector('#header-menu-toggle'),menuPanel=root.querySelector('#header-menu-panel'),drawerItems=menuPanel.querySelector('.drawer-items');
 let previousOverflow='';
 function closeHeaderMenu(){if(menuPanel.open)menuPanel.close();}
 function addDrawerItem(title,iconName,action){const item=document.createElement('button');item.type='button';item.className='drawer-item';const icon=document.createElement('span');icon.className='drawer-icon';icon.setAttribute('aria-hidden','true');icon.style.setProperty('--menu-icon',`url("${new URL(`./menu-${iconName}.png`,import.meta.url).href}")`);const label=document.createElement('span');label.textContent=title;item.append(icon,label);item.onclick=()=>{closeHeaderMenu();action();};drawerItems.append(item);}
 drawerItems.replaceChildren();
 for(const title of ['캐릭터','동기','장비','이잘키','공략집','육성 계산기']){const menu=data.menus.find(m=>m.title===title);if(menu)addDrawerItem(title==='공략집'?'공략':title,title==='동기'?'motive':title==='장비'?'equipment':'character',()=>openMenu(menu));}
 addDrawerItem('입문 가이드','character',revealBeginner);
 menuToggle.onclick=()=>{if(menuPanel.open){closeHeaderMenu();return;}previousOverflow=document.documentElement.style.overflow;menuPanel.showModal();menuToggle.setAttribute('aria-expanded','true');document.documentElement.style.overflow='hidden';};
 menuPanel.addEventListener('close',()=>{menuToggle.setAttribute('aria-expanded','false');document.documentElement.style.overflow=previousOverflow;});
 menuPanel.addEventListener('cancel',e=>e.preventDefault());
 menuPanel.addEventListener('click',e=>{if(e.target!==menuPanel)return;const b=menuPanel.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeHeaderMenu();});
 root.querySelector('#term-guide-open').onclick=()=>show('용어 가이드',['용어 가이드는 준비 중입니다.']);
 mountSearch(root,records);
 root.querySelector('#b-close').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}};
 // Keep the paper section joins on the printed dividers as the layout resizes.
 const lowerMasthead=root.querySelector('.masthead-lower');
 let paperFrame=0;
 function alignPaperCuts(){
  paperFrame=0;
  const sheet=root.getBoundingClientRect(),upper=lowerMasthead.getBoundingClientRect(),menu=menus.getBoundingClientRect();
  const rule=getComputedStyle(menus,'::after');
  const lowerCenter=menu.bottom-(parseFloat(rule.bottom)||0)-(parseFloat(rule.height)||5)/2;
  root.style.setProperty('--paper-top-cut',Math.max(0,upper.top+upper.height/2-sheet.top)+'px');
  root.style.setProperty('--paper-bottom-cut',Math.max(0,sheet.bottom-lowerCenter)+'px');
 }
 function queuePaperCuts(){if(!paperFrame)paperFrame=requestAnimationFrame(alignPaperCuts);}
 const paperObserver=new ResizeObserver(queuePaperCuts);
 [root,root.querySelector('.site-header'),menus].forEach(element=>paperObserver.observe(element));
 document.fonts.ready.then(queuePaperCuts);
 queuePaperCuts();

}
