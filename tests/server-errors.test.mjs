import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import * as Sentry from '@sentry/node';
import { initializeErrorTracking, reportServerError, sanitizeErrorEvent } from '../lib/error-tracking.ts';

test('events contain only generic failure and bounded operational fields', () => {
  const event = sanitizeErrorEvent({
    environment: 'production', exception: { values: [{ type: 'private-type', value: 'private-message' }] },
    user: { email: 'private-email' }, request: { url: 'private-url' },
    breadcrumbs: [{ message: 'private-breadcrumb' }], extra: { value: 'private-extra' },
    contexts: { private: { value: 'private-context' } }, tags: { private: 'private-tag' },
    release: 'private-release', server_name: 'private-host',
  });
  assert.deepEqual(event.exception.values, [{ type: 'UnhandledApplicationError', value: 'Unhandled application error' }]);
  assert.deepEqual(event.tags, { component: 'public-site-server' });
  assert.ok(!JSON.stringify(event).includes('private-'));
  for (const key of ['request', 'user', 'breadcrumbs', 'extra', 'contexts', 'release', 'server_name']) assert.equal(event[key], undefined);
});

test('unset DSN is disabled and enabled SDK delivers exactly one sanitized event', async (t) => {
  const previousDsn = process.env.SENTRY_DSN;
  const previousEnvironment = process.env.NODE_ENV;
  const envelopes = [];
  const collector = createServer((req, res) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => { envelopes.push(Buffer.concat(chunks).toString()); res.end('{}'); });
  });
  t.after(async () => {
    await Sentry.close(2000);
    collector.closeAllConnections();
    await new Promise((resolve) => collector.close(resolve));
    if (previousDsn === undefined) delete process.env.SENTRY_DSN; else process.env.SENTRY_DSN = previousDsn;
    if (previousEnvironment === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousEnvironment;
  });
  process.env.SENTRY_DSN = ' ';
  initializeErrorTracking();
  await reportServerError();
  assert.equal(Sentry.getClient(), undefined);
  await new Promise((resolve) => collector.listen(0, '127.0.0.1', resolve));
  const address = collector.address();
  assert.ok(address && typeof address !== 'string');
  process.env.SENTRY_DSN = `http://synthetic@127.0.0.1:${address.port}/1`;
  process.env.NODE_ENV = 'production';
  initializeErrorTracking();
  Sentry.setUser({ email: 'private-email' });
  Sentry.setTag('private-tag', 'private-value');
  Sentry.addBreadcrumb({ message: 'private-breadcrumb' });
  await reportServerError();
  assert.equal(envelopes.length, 1);
  assert.ok(!envelopes[0].includes('private-'));
  const event = JSON.parse(envelopes[0].trim().split('\n').at(-1));
  assert.equal(event.environment, 'production');
  assert.deepEqual(event.tags, { component: 'public-site-server' });
  assert.deepEqual(event.exception.values, [{ type: 'UnhandledApplicationError', value: 'Unhandled application error' }]);
  for (const key of ['request', 'user', 'breadcrumbs', 'extra', 'contexts', 'release', 'server_name']) assert.equal(event[key], undefined);
});
