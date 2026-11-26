import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { spawn, execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, copyFile, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { once } from 'node:events';

const listen = async (server) => {
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  return address.port;
};

test('production Next hook reports a failed route without changing its HTTP response', { timeout: 120000 }, async (t) => {
  const root = resolve('.');
  const fixture = await mkdtemp(join(tmpdir(), 'legacy-next-error-hook-'));
  const envelopes = [];
  const collector = createServer((req, res) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => { envelopes.push(Buffer.concat(chunks).toString()); res.end('{}'); });
  });
  let child;
  t.after(async () => {
    if (child && child.exitCode === null) { child.kill('SIGTERM'); await once(child, 'exit'); }
    collector.closeAllConnections();
    await new Promise((done) => collector.close(done));
    await rm(fixture, { recursive: true, force: true });
  });
  const collectorPort = await listen(collector);
  const reservation = createServer();
  const port = await listen(reservation);
  await new Promise((done) => reservation.close(done));
  await mkdir(join(fixture, 'lib'));
  await mkdir(join(fixture, 'app', 'api', 'failure'), { recursive: true });
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir');
  await copyFile(join(root, 'instrumentation.ts'), join(fixture, 'instrumentation.ts'));
  await copyFile(join(root, 'lib', 'error-tracking.ts'), join(fixture, 'lib', 'error-tracking.ts'));
  await writeFile(join(fixture, 'package.json'), JSON.stringify({ private: true, dependencies: { next: '15.5.29', react: '18.2.0', 'react-dom': '18.2.0' } }));
  await writeFile(join(fixture, 'next.config.js'), 'module.exports = { experimental: { cpus: 1 } };');
  await writeFile(join(fixture, 'app', 'layout.js'), 'export default function Layout({children}) { return <html><body>{children}</body></html>; }');
  await writeFile(join(fixture, 'app', 'page.js'), 'export default function Page() { return <p>fixture ready</p>; }');
  await writeFile(join(fixture, 'app', 'api', 'failure', 'route.js'), "export const dynamic = 'force-dynamic'; export async function POST() { throw new Error('private-original-error'); }");
  const env = { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1', SENTRY_DSN: '' };
  const cli = join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
  execFileSync(process.execPath, [cli, 'build'], { cwd: fixture, env, stdio: 'pipe', timeout: 90000 });
  child = spawn(process.execPath, [cli, 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: fixture, env: { ...env, SENTRY_DSN: `http://synthetic@127.0.0.1:${collectorPort}/1` }, stdio: 'pipe',
  });
  child.stdout.resume();
  child.stderr.resume();
  const origin = `http://127.0.0.1:${port}`;
  let healthy = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    try { if ((await fetch(origin)).status === 200) { healthy = true; break; } } catch {}
    if (child.exitCode !== null) break;
    await new Promise((done) => setTimeout(done, 100));
  }
  assert.ok(healthy, 'fixture must become ready');
  assert.equal(envelopes.length, 0);
  const response = await fetch(origin + '/api/failure?token=private-query', {
    method: 'POST', headers: { Cookie: 'private-cookie', Authorization: 'Bearer private-auth', 'X-Request-ID': 'private-caller-id' }, body: 'private-body',
  });
  assert.equal(response.status, 500);
  assert.equal((await fetch(origin)).status, 200);
  assert.equal(envelopes.length, 1);
  assert.ok(!envelopes[0].includes('private-'));
  const event = JSON.parse(envelopes[0].trim().split('\n').at(-1));
  assert.equal(event.environment, 'production');
  assert.deepEqual(event.exception.values, [{ type: 'UnhandledApplicationError', value: 'Unhandled application error' }]);
  assert.deepEqual(event.tags, { component: 'public-site-server' });
  for (const key of ['request', 'user', 'breadcrumbs', 'extra', 'contexts', 'release', 'server_name']) assert.equal(event[key], undefined);
  collector.closeAllConnections();
  await new Promise((done) => collector.close(done));
  const unavailable = await fetch(origin + '/api/failure', { method: 'POST' });
  assert.equal(unavailable.status, 500, 'collector outage must preserve the application error response');
  assert.equal((await fetch(origin)).status, 200);
});
