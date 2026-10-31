import assert from 'node:assert/strict';
import {readHome,validate,render} from './content.mjs';
const home=await readHome();validate(home);const html=await render(home);
assert(!html.includes('{{headline}}'));assert(html.includes(home.headline));
assert.throws(()=>validate({...home,notice:''}));
const injected=await render({...home,headline:'<script>alert(1)</script>'});assert(injected.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
console.log('Content validation and HTML escaping passed.');
