export function validate(data) {
  const keys=['heading','description','beginnerTitle','beginnerDescription','updateText','updateDate'];
  if(!data || keys.some(k=>typeof data[k]!=='string'||data[k].length>500)) throw Error('문구는 500자 이하로 입력하세요.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(data.updateDate)||Number.isNaN(Date.parse(data.updateDate))) throw Error('날짜를 확인하세요.');
  if(!Array.isArray(data.menus)||data.menus.length!==5) throw Error('메뉴는 5개여야 합니다.');
  data.menus.forEach(m=>{
    if(!m||typeof m.title!=='string'||!m.title.trim()||m.title.length>60||typeof m.description!=='string'||m.description.length>200||typeof m.url!=='string') throw Error('메뉴 입력을 확인하세요.');
    if(m.url && !(m.url.startsWith('/')&&!m.url.startsWith('//')&&!m.url.includes('\\')) && !/^https:\/\//.test(m.url)) throw Error('링크는 /로 시작하는 내부 경로나 https 주소를 사용하세요.');
  });
  return data;
}
export function render(data) {
  validate(data);
  document.querySelector('h1').textContent=data.heading;
  document.querySelector('h1').style.whiteSpace='pre-line';
  document.querySelector('.intro p').textContent=data.description;
  document.querySelector('.beginner h2').textContent=data.beginnerTitle;
  document.querySelector('.beginner p').textContent=data.beginnerDescription;
  document.querySelector('.logrow p').textContent=data.updateText;
  const date=document.querySelector('.logrow time');date.dateTime=data.updateDate;date.textContent=data.updateDate.replaceAll('-','.');
  document.querySelectorAll('.card').forEach((card,i)=>{
    const m=data.menus[i];card.querySelector('h3').textContent=m.title;card.querySelector('p').textContent=m.description;
    card.dataset.title=m.title;card.dataset.terms=m.title+' '+m.description;
    card.onclick=()=>{if(m.url)location.assign(m.url);else{document.querySelector('#title').textContent=m.title;document.querySelector('#dialog').showModal();}};
  });
}
if(typeof document!=='undefined'&&document.querySelector('.intro')) {
  fetch(new URL('../data/home.json',import.meta.url),{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(render).catch(()=>console.warn('기본 홈 화면을 표시합니다.'));
  addEventListener('message',e=>{if(e.origin===location.origin&&e.source===parent&&e.data?.type==='home-preview'){try{render(e.data.data);}catch{}}});
}
