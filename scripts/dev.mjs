import http from 'node:http';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {root,readHome,render,validate} from './content.mjs';
const arg=(key,fallback)=>{const i=process.argv.indexOf(key);return i>=0?process.argv[i+1]:fallback};
const port=Number(arg('--port',process.env.PORT||4321));
const host=arg('--host','127.0.0.1');
const draftPath=new URL('.local/home-draft.json',root);
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const send=(status,body,type='application/json')=>{res.writeHead(status,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"frame-ancestors 'self'"});res.end(typeof body==='string'?body:JSON.stringify(body))};
 try{
  if(req.method==='GET'&&url.pathname==='/')return send(200,await render(await readHome()),'text/html');
  if(req.method==='GET'&&['/admin','/admin/'].includes(url.pathname))return send(200,await readFile(new URL('apps/admin/index.html',root),'utf8'),'text/html');
  if(req.method==='GET'&&url.pathname==='/api/content'){let draft;try{draft=validate(JSON.parse(await readFile(draftPath,'utf8')))}catch(e){if(e.code!=='ENOENT')throw e}return send(200,{published:await readHome(),draft: draft||await readHome(),mode:'local',deployConfigured:false})}
  if(req.method==='POST'&&['/api/draft','/api/preview','/api/publish'].includes(url.pathname)){
   // The local editor accepts same-origin browser requests only. Never deploy this server.
   if(!req.headers.origin || new URL(req.headers.origin).host!==req.headers.host)return send(403,{error:'요청 출처를 확인할 수 없습니다.'});
   if(!String(req.headers['content-type']).startsWith('application/json'))return send(415,{error:'JSON 요청이 필요합니다.'});
   let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>16384)return send(413,{error:'입력 크기를 초과했습니다.'})}
   const value=validate(JSON.parse(body));
   if(url.pathname==='/api/publish')return send(503,{error:'Cloudflare 배포와 관리자 인증을 연결한 뒤 사용할 수 있습니다.'});
   if(url.pathname==='/api/preview')return send(200,await render(value),'text/html');
   await mkdir(new URL('.local/',root),{recursive:true});await writeFile(new URL('.local/home-draft.tmp',root),JSON.stringify(value,null,2)+'\n');await rename(new URL('.local/home-draft.tmp',root),draftPath);return send(200,{saved:true,savedAt:new Date().toISOString()});
  }
  send(404,{error:'페이지를 찾을 수 없습니다.'});
 }catch(e){send(400,{error:e instanceof SyntaxError?'JSON 형식이 올바르지 않습니다.':e.message})}
});
server.listen(port,host,()=>console.log(`Local site: http://localhost:${port}\nLocal admin: http://localhost:${port}/admin/`));
