import {mkdir,copyFile,cp,rm,readFile} from 'node:fs/promises';
import {validate} from '../assets/home.js';
validate(JSON.parse(await readFile('data/home.json','utf8')));
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
await copyFile('index.html','dist/index.html');
for(const dir of ['assets','data'])await cp(dir,'dist/'+dir,{recursive:true});
console.log('이용자 사이트 dist 빌드 완료');
