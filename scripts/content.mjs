import {readFile} from 'node:fs/promises';
export const root = new URL('../', import.meta.url);
export async function readHome(){return JSON.parse(await readFile(new URL('content/home.json',root),'utf8'))}
export function validate(value){
 if(!value || value.schemaVersion!==1) throw Error('지원하지 않는 데이터 형식입니다.');
 for(const key of ['headline','highlight','description','notice']){
  if(typeof value[key]!=='string'||!value[key].trim()||value[key].length>300)throw Error(key+': 1~300자의 문구를 입력하세요.');
 }
 return Object.fromEntries(['schemaVersion','headline','highlight','description','notice'].map(k=>[k,value[k]]));
}
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function render(value){validate(value);let html=await readFile(new URL('apps/site/index.html',root),'utf8');for(const [k,v]of Object.entries(value))if(k!=='schemaVersion')html=html.replaceAll('{{'+k+'}}',escape(v));return html}
