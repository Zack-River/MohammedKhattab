/* eslint-disable @typescript-eslint/no-require-imports -- Server-only Supabase Management API CLI; never bundled. */
const fs=require('node:fs');
process.loadEnvFile('.env.local');
const token=process.env.SUPABASE_ACCESS_TOKEN;
if(!token) throw new Error('Add a Supabase personal access token as SUPABASE_ACCESS_TOKEN in ignored .env.local. Auth secret keys cannot configure hosted templates.');
const host=new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
if(!/^[a-z0-9]+\.supabase\.co$/.test(host)) throw new Error('Expected the dedicated hosted Supabase project URL.');
const endpoint=`https://api.supabase.com/v1/projects/${host.split('.')[0]}/config/auth`;
const headers={Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
const payload=JSON.parse(fs.readFileSync('supabase/templates/hosted-config.json','utf8'));
async function request(method,body) {
  const result=await fetch(endpoint,{method,headers,body:body&&JSON.stringify(body),signal:AbortSignal.timeout(30000)});
  if(!result.ok) throw new Error(`Supabase Management API returned HTTP ${result.status}; templates were not verified.`);
  return result.json();
}
(async()=>{
  const before=await request('GET');
  fs.writeFileSync('/tmp/khatab-email-templates-before.json',JSON.stringify(Object.fromEntries(Object.keys(payload).map(key=>[key,before[key]])),null,2),{mode:0o600});
  await request('PATCH',payload);
  const after=await request('GET');
  if(!Object.entries(payload).every(([key,value])=>after[key]===value)) throw new Error('Hosted template verification failed.');
  console.log(`Verified ${Object.keys(payload).length/2} hosted email templates. SMTP, redirects and security notification switches were preserved.`);
})().catch(error=>{console.error(error.message);process.exitCode=1;});
