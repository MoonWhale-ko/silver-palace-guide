export function validate(data) {
  const keys=['heading','description','beginnerTitle','beginnerDescription','updateText','updateDate'];
  if(!data || keys.some(k=>typeof data[k]!=='string'||data[k].length>500)) throw Error('문구는 500자 이하로 입력하세요.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(data.updateDate)||Number.isNaN(Date.parse(data.updateDate))) throw Error('날짜를 확인하세요.');
  if(!Array.isArray(data.menus)||data.menus.length!==6) throw Error('메뉴는 6개여야 합니다.');
  data.menus.forEach(m=>{
    if(!m||typeof m.title!=='string'||!m.title.trim()||m.title.length>60||typeof m.description!=='string'||m.description.length>200||typeof m.url!=='string') throw Error('메뉴 입력을 확인하세요.');
    if(m.url && !(m.url.startsWith('/')&&!m.url.startsWith('//')&&!m.url.includes('\\')) && !/^https:\/\//.test(m.url)) throw Error('링크는 /로 시작하는 내부 경로나 https 주소를 사용하세요.');
  });
  if(data.guides!==undefined){
    if(!Array.isArray(data.guides)||data.guides.length>6)throw Error('입문 가이드는 6개 이하로 입력하세요.');
    data.guides.forEach(g=>{if(!g||['category','title','description'].some(k=>typeof g[k]!=='string'||g[k].length>200)||!Array.isArray(g.paragraphs)||g.paragraphs.length>10||g.paragraphs.some(p=>typeof p!=='string'||p.length>2000))throw Error('가이드 내용을 확인하세요.');});
  }
  return data;
}
export async function render(data){validate(data);const {mount}=await import('./site-runtime.js');mount(data);}
if(typeof document!=='undefined'&&document.querySelector('#ss-blue-silver')){
 window.__silverHomeReady=fetch(new URL('../data/home.json',import.meta.url),{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('콘텐츠를 읽지 못했습니다.');return r.json();}).then(render).catch(e=>{console.error(e);document.querySelector('.b-intro').textContent='콘텐츠를 불러오지 못했습니다. 새로고침해주세요.';});
}
