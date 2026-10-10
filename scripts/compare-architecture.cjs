/* eslint-disable @typescript-eslint/no-require-imports -- Offline evidence comparison using installed Playwright PNG decoder. */
const fs=require('node:fs');
const path=require('node:path');
const {PNG}=require('../node_modules/playwright-core/lib/utilsBundle.js');
const root=path.resolve('docs/evidence/architecture-acceptance');
const phase=process.argv[2]||'final';
const before=JSON.parse(fs.readFileSync(path.join(root,'baseline/screens.json')));
const after=JSON.parse(fs.readFileSync(path.join(root,phase,'screens.json')));
const results=before.map(base=>{
 const current=after.find(item=>item.name===base.name);
 const a=PNG.sync.read(fs.readFileSync(path.join(root,'baseline',base.name+'.png')));
 const b=PNG.sync.read(fs.readFileSync(path.join(root,phase,base.name+'.png')));
 let changed=0;
 if(a.width===b.width&&a.height===b.height){
  for(let i=0;i<a.data.length;i+=4)if(Math.max(...[0,1,2].map(c=>Math.abs(a.data[i+c]-b.data[i+c])))>25.5)changed++;
 }
 const bounds=[];
 base.geometry.forEach((item,index)=>{
  const next=current.geometry[index];
  if(!next||next.class!==item.class||['x','y','width','height'].some(key=>Math.abs(item[key]-next[key])>1))bounds.push({before:item,after:next});
 });
 return {name:base.name,dimensions:[a.width,a.height,b.width,b.height],pixelRatio:a.width===b.width&&a.height===b.height?changed/(a.width*a.height):null,bounds,overflow:current.overflow,errors:current.errors};
});
fs.writeFileSync(path.join(root,phase,'comparison.json'),JSON.stringify(results,null,2));
for(const result of results)if(result.pixelRatio===null||result.pixelRatio>.001||result.bounds.length||result.errors.length||result.overflow>1)console.log(JSON.stringify({name:result.name,pixelRatio:result.pixelRatio,bounds:result.bounds.length,dimensions:result.dimensions,overflow:result.overflow,errors:result.errors}));
console.log(`Compared ${results.length} screenshots; detailed differences saved in ${phase}/comparison.json`);
