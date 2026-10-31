import {mkdir,writeFile,copyFile} from 'node:fs/promises';
import {root,readHome,render} from './content.mjs';
await mkdir(new URL('dist/site/',root),{recursive:true});await mkdir(new URL('dist/admin/',root),{recursive:true});
await writeFile(new URL('dist/site/index.html',root),await render(await readHome()));
await copyFile(new URL('apps/admin/index.html',root),new URL('dist/admin/index.html',root));
console.log('Built dist/site and dist/admin. Admin preview only; production API is not configured.');
