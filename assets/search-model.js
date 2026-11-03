const normalize=value=>value.normalize('NFC').trim();
const key=value=>normalize(value).toLocaleLowerCase('ko');
export function sanitizeHistory(value){
 if(!Array.isArray(value))return [];
 const seen=new Set(),out=[];
 for(const term of value){if(typeof term!=='string')continue;const clean=normalize(term);if(!clean||clean.length>200||seen.has(key(clean)))continue;seen.add(key(clean));out.push(clean);if(out.length===30)break;}
 return out;
}
export function remember(history,term){const clean=normalize(term);if(!clean||clean.length>200)return sanitizeHistory(history);return sanitizeHistory([clean,...history.filter(t=>key(t)!==key(clean))]);}
export function forget(history,term){return history.filter(t=>key(t)!==key(term));}
export function suggest(titles,query){const q=key(query);if(!q)return [];const unique=new Map();for(const title of titles){const clean=normalize(title);if(key(clean).includes(q)&&!unique.has(key(clean)))unique.set(key(clean),clean);}return [...unique.values()].sort((a,b)=>a.localeCompare(b,'ko')).slice(0,6);}

export function findRecords(records,query){const q=key(query);if(!q)return [];return records.filter(r=>key(r.title+' '+r.description).includes(q)).sort((a,b)=>a.title.localeCompare(b.title,'ko'));}
