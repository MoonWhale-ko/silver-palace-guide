import {createRemoteJWKSet,jwtVerify} from 'jose';
import {validate} from '../assets/home.js';
let keys,issuer;
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export default {async fetch(request,env){
  try {
    const url=new URL(request.url);
    if(!env.ACCESS_TEAM_DOMAIN||!env.ACCESS_AUD) return new Response('관리자 접근 인증 설정이 필요합니다.',{status:503});
    const domain=env.ACCESS_TEAM_DOMAIN;
    if(!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(domain)) return new Response('인증 도메인 설정 오류',{status:503});
    if(issuer!==domain){issuer=domain;keys=createRemoteJWKSet(new URL('https://'+domain+'/cdn-cgi/access/certs'));}
    try {await jwtVerify(request.headers.get('Cf-Access-Jwt-Assertion')||'',keys,{issuer:'https://'+domain,audience:env.ACCESS_AUD});}
    catch {return new Response('관리자 로그인이 필요합니다.',{status:401});}
    if(url.pathname!=='/api/home') return env.ASSETS.fetch(request);
    if(!['GET','PUT'].includes(request.method))return json({error:'지원하지 않는 요청입니다.'},405);
    if(request.method==='PUT'&&request.headers.get('Origin')!==url.origin)return json({error:'요청 출처가 다릅니다.'},403);
    if(!env.GITHUB_TOKEN)return json({error:'GitHub 저장 연결이 필요합니다.'},503);
    const endpoint='https://api.github.com/repos/MoonWhale-ko/silver-palace-guide/contents/data/home.json';
    const headers={'Authorization':'Bearer '+env.GITHUB_TOKEN,'Accept':'application/vnd.github+json','User-Agent':'silver-stream-admin','X-GitHub-Api-Version':'2022-11-28'};
    if(request.method==='GET'){
      const response=await fetch(endpoint+'?ref=main',{headers});
      if(!response.ok)return json({error:'GitHub 데이터를 불러오지 못했습니다.'},502);
      const file=await response.json();const bytes=Uint8Array.from(atob(file.content.replace(/\s/g,'')),c=>c.charCodeAt(0));
      return json({data:JSON.parse(new TextDecoder().decode(bytes)),sha:file.sha});
    }
    if(Number(request.headers.get('Content-Length'))>20000)return json({error:'입력 용량이 너무 큽니다.'},413);
    const raw=await request.text();if(raw.length>20000)return json({error:'입력 용량이 너무 큽니다.'},413);
    let body;try{body=JSON.parse(raw);validate(body.data);if(!/^[a-f0-9]{40}$/.test(body.sha))throw Error('다시 불러온 후 저장하세요.');}catch(e){return json({error:e.message},400);}
    const bytes=new TextEncoder().encode(JSON.stringify(body.data,null,2)+'\n');let binary='';bytes.forEach(b=>binary+=String.fromCharCode(b));
    const response=await fetch(endpoint,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({message:'홈 화면 설정 변경',branch:'main',sha:body.sha,content:btoa(binary)})});
    if(!response.ok)return json({error:response.status===409?'다른 변경이 있습니다. 다시 불러온 후 수정하세요.':'GitHub 저장에 실패했습니다.'},response.status===409?409:502);
    const result=await response.json();return json({sha:result.content.sha,commit:result.commit.sha});
  }catch{return json({error:'요청 처리에 실패했습니다.'},500);}
}};
