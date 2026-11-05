import {mkdir,cp,rm,readFile,readdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {validate} from '../assets/home.js';
validate(JSON.parse(await readFile('data/home.json','utf8')));
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const dir of ['assets','data'])await cp(dir,'dist/'+dir,{recursive:true});
// Decode the application artwork into ordinary WebP files for the public site.
const imageSources = (await readdir('source-images', {recursive:true})).filter(path => path.endsWith('.webp.b64'));
for (const path of imageSources) {
 const output = 'dist/assets/' + path.slice(0,-4);
 const folder = output.slice(0, output.lastIndexOf('/'));
 await mkdir(folder, {recursive:true});
 const encoded = await readFile('source-images/' + path, 'utf8');
 await writeFile(output, Buffer.from(encoded, 'base64'));
}
const files=['characters.html','assets/catalog-header.css','assets/catalog-header.js','assets/catalog-divider.png','assets/catalog-sort-bg.png','assets/desk-scene.css','assets/folder-catalog.js','assets/application-sheet.js','assets/character-record.js','assets/character-record.css','assets/opening-motion.js','assets/site-runtime.js','data/characters.json',...imageSources.map(path => 'source-images/' + path).sort()];
const version=createHash('sha256');for(const file of files)version.update(await readFile(file));const hash=version.digest('hex').slice(0,12);
for(const page of ['index.html','characters.html']){let html=await readFile(page,'utf8');html=html.replace(/(\.\/assets\/[^"']+\.(?:css|js))/g,'$1?v='+hash);await writeFile('dist/'+page,html);}
for(const [file,imports] of Object.entries({'home.js':['site-runtime.js'],'site-runtime.js':['search-popup.js'],'catalog-header.js':['search-popup.js'],'folder-catalog.js':['application-sheet.js','character-record.js','opening-motion.js'],'search-popup.js':['search-model.js']})){let js=await readFile('assets/'+file,'utf8');for(const name of imports)js=js.replace("'./"+name+"'","'./"+name+"?v="+hash+"'");await writeFile('dist/assets/'+file,js);}
console.log('이용자 사이트 dist 빌드 완료 · '+hash);
