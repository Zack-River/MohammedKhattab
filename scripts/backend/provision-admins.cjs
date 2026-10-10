/* eslint-disable @typescript-eslint/no-require-imports -- One-time Auth provisioning; secrets remain local. */
const { createClient } = require('@supabase/supabase-js');
const accounts = require('../../config/admin-accounts.json');
process.loadEnvFile('.env.local');
const key = process.env.SUPABASE_SECRET_KEY;
if (!key) throw new Error('Set SUPABASE_SECRET_KEY in ignored .env.local');
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
(async () => {
  const { data, error } = await client.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw new Error('Cannot access hosted Auth admin API');
  for (const account of accounts) {
    const password = process.env[account.passwordEnvironment];
    if (!password) throw new Error('Missing local account password');
    const existing = data.users.find(user => user.email?.toLowerCase() === account.email);
    const values = { email: account.email, password, email_confirm: true, user_metadata: { name: account.name } };
    const result = existing ? await client.auth.admin.updateUserById(existing.id, values) : await client.auth.admin.createUser(values);
    if (result.error || !result.data.user) throw new Error('Admin provisioning failed; credentials omitted');
    const user = result.data.user;
    const profile = await client.from('profiles').upsert({ id: user.id, name: account.name }, { ignoreDuplicates: true });
    const membership = await client.from('admin_users').upsert({ user_id: user.id });
    if (profile.error || membership.error) throw new Error('Admin membership provisioning failed');
    console.log(`Provisioned verified admin: ${account.email}`);
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
