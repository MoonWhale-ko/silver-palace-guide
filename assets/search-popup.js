import {sanitizeHistory,remember,forget,suggest,findRecords} from './search-model.js';
export function mountSearch(root,records){
 const popup=root.querySelector('#search-dialog'),input=root.querySelector('#b-search'),options=root.querySelector('#search-options'),footer=root.querySelector('#search-history-footer');
 const storageKey='silver-stream-search-history-v1';let history=[];
 function load(){try{history=sanitizeHistory(JSON.parse(localStorage.getItem(storageKey)));}catch{history=[];}}
 function persist(){try{localStorage.setItem(storageKey,JSON.stringify(history));}catch{}}
 function setInput(term){input.value=term;render();input.focus();input.setSelectionRange?.(term.length,term.length);}
 function close(){popup.close();}
 function noResults(){
  root.querySelector('#search-list-title').textContent='검색 결과';options.replaceChildren();const empty=document.createElement('p');empty.className='search-empty';empty.setAttribute('role','status');empty.textContent='검색 결과가 없습니다';options.append(empty);footer.hidden=false;footer.style.visibility='hidden';
 }
 function showResults(q,matches,push=false){
  const panel=root.querySelector('#search-results'),list=root.querySelector('#results-list');panel.hidden=false;root.dataset.view='results';list.replaceChildren();root.querySelector('#search-status').textContent=`‘${q}’ 검색 결과 ${matches.length}개`;
  matches.forEach(record=>{const row=document.createElement('button');row.type='button';row.className='result-row';const tag=document.createElement('small'),body=document.createElement('span'),title=document.createElement('strong'),description=document.createElement('small');tag.textContent=record.type;title.textContent=record.title;description.textContent=record.description;body.append(title,description);row.append(tag,body);row.onclick=record.open;list.append(row);});
  if(!matches.length){const empty=document.createElement('p');empty.className='search-empty';empty.textContent='검색 결과가 없습니다';list.append(empty);}
  if(push){const url=new URL(location.href);url.searchParams.set('q',q);window.history.pushState(null,'',url);}
  if(popup.open)close();window.scrollTo({top:0});root.querySelector('#search-heading').focus({preventScroll:true});
 }
 function run(term){
  const q=term.trim();if(!q){noResults();return;}
  history=remember(history,q);persist();input.value=q;
  const matches=findRecords(records,q);if(!matches.length){noResults();return;}showResults(q,matches,true);
 }
 function home(push=false){root.dataset.view='home';root.querySelector('#search-results').hidden=true;if(push){const url=new URL(location.href);url.searchParams.delete('q');window.history.pushState(null,'',url);}root.querySelector('#search-toggle').focus();}
 function restoreRoute(){const q=new URL(location.href).searchParams.get('q');if(q)showResults(q,findRecords(records,q));else home();}
 function render(){
  const typing=Boolean(input.value.trim()),items=typing?suggest(records.map(r=>r.title),input.value):history.slice(0,6);
  root.querySelector('#search-list-title').textContent=typing?'추천 검색어':'최근 검색';footer.hidden=false;footer.style.visibility=typing?'hidden':'visible';root.querySelector('#history-clear').disabled=!history.length;options.replaceChildren();
  if(!items.length){const empty=document.createElement('p');empty.className='search-empty';empty.textContent=typing?'일치하는 추천 검색어가 없습니다.':'최근 검색 기록이 없습니다.';options.append(empty);return;}
  items.forEach(term=>{const row=document.createElement('div');row.className='search-option';const choose=document.createElement('button');choose.type='button';choose.className='search-term';choose.textContent=term;choose.onclick=()=>run(term);const action=document.createElement('button');action.type='button';action.className='search-option-action';action.textContent=typing?'↖':'×';action.setAttribute('aria-label',typing?term+' 입력하기':term+' 기록 삭제');action.onclick=()=>{if(typing){setInput(term);return;}const index=history.indexOf(term);history=forget(history,term);persist();render();const remaining=[...options.querySelectorAll('.search-option-action')];(remaining[Math.min(index,remaining.length-1)]||input).focus();};row.append(choose,action);options.append(row);});
 }
 root.querySelector('#search-toggle').onclick=()=>{load();input.value='';render();if(!popup.open)popup.showModal();input.focus();};
 popup.addEventListener('click',e=>{if(e.target===popup){const b=popup.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)close();}});
 input.oninput=render;root.querySelector('.popup-search').onsubmit=e=>{e.preventDefault();run(input.value);};root.querySelector('#history-clear').onclick=()=>{history=[];persist();render();input.focus();};
 root.querySelector('#clear-search').onclick=()=>home(true);window.addEventListener('popstate',restoreRoute);if(new URL(location.href).searchParams.has('q'))restoreRoute();
}
