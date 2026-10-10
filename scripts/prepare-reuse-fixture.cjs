/* eslint-disable @typescript-eslint/no-require-imports -- Isolated test app preparation. */
const fs=require("node:fs"),path=require("node:path"),{spawnSync}=require("node:child_process");
const root=path.resolve(__dirname,".."),fixture=path.join(root,"tests/platform/fixtures/reuse");
for(const [name,target] of [["node_modules","../../../../node_modules"],["public","../../../../public"]]){
 const link=path.join(fixture,name);
 if(!fs.existsSync(link))fs.symlinkSync(target,link,"dir");
 else if(!fs.lstatSync(link).isSymbolicLink()||fs.readlinkSync(link)!==target)throw new Error(`Unexpected fixture path: ${link}`);
}
const result=spawnSync(process.execPath,[path.join(root,"node_modules/next/dist/bin/next"),"build",fixture],{cwd:root,stdio:"inherit"});
process.exitCode=result.status??1;
