import {mkdir,cp,rm,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {validate} from '../assets/home.js';
validate(JSON.parse(await readFile('data/home.json','utf8')));
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const dir of ['assets','data'])await cp(dir,'dist/'+dir,{recursive:true});
const files=['characters.html','assets/catalog-header.css','assets/catalog-header.js','assets/catalog-divider.png','assets/catalog-sort-bg.png','assets/desk-scene.css','assets/folder-catalog.js','assets/character-record.js','assets/character-record.css','assets/opening-motion.js','assets/site-runtime.js','data/characters.json'];
const version=createHash('sha256');for(const file of files)version.update(await readFile(file));const hash=version.digest('hex').slice(0,12);
for(const page of ['index.html','characters.html']){let html=await readFile(page,'utf8');html=html.replace(/(\.\/assets\/[^"']+\.(?:css|js))/g,'$1?v='+hash);await writeFile('dist/'+page,html);}
for(const [file,imports] of Object.entries({'home.js':['site-runtime.js'],'site-runtime.js':['search-popup.js'],'catalog-header.js':['search-popup.js'],'folder-catalog.js':['character-record.js','opening-motion.js'],'search-popup.js':['search-model.js']})){let js=await readFile('assets/'+file,'utf8');for(const name of imports)js=js.replace("'./"+name+"'","'./"+name+"?v="+hash+"'");await writeFile('dist/assets/'+file,js);}
console.log('이용자 사이트 dist 빌드 완료 · '+hash);
