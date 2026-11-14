import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
const html=await fs.readFile('index.html','utf8'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length);assert.match(html,/<html lang="en">/);
let checked=0;
for(const [,value]of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)){
  if(value.startsWith('#'))assert(ids.includes(value.slice(1)),`Missing anchor ${value}`);
  if(value.startsWith('./'))await fs.access(value);checked++;
}
for(const file of (await fs.readdir('.')).filter(file=>file.endsWith('.js')||file.endsWith('.mjs'))){
  const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);checked++;
  const content=await fs.readFile(file,'utf8');for(const [,value]of content.matchAll(/from ['"](\.[^'"]+)['"]/g))await fs.access(path.resolve(value));
}
for(const file of ['map.css','assets/iowa-aerial.jpg','assets/iowa-aerial-metadata.json','assets/prototype.mp4','vendor/three.module.js','vendor/three.core.js'])await fs.access(file);
console.log(`PASS standalone source: ${checked} references and syntax checks, local dependencies and assets present.`);
