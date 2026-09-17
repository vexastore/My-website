import { spawn } from 'node:child_process';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !publishable || !secret || [url, publishable, secret].some(value => value.startsWith('YOUR_'))) {
  console.error('Staging Supabase URL, publishable key, and server-only secret are required.');
  process.exit(1);
}

let hostname;
try { hostname = new URL(url).hostname; } catch { /* Rejected below. */ }
if (!hostname?.endsWith('.supabase.co') || hostname === 'sneihqexrinsjtzazbus.supabase.co') {
  console.error('Refusing to start staging checkout against the live Supabase project.');
  process.exit(1);
}

const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', process.env.PORT || '3001'], {
  stdio: 'inherit', env: process.env,
});
child.on('exit', (code, signal) => { process.exitCode = signal ? 1 : code ?? 1; });
