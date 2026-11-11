#!/usr/bin/env node
// CI check: fails when the pull request title, body or any of its commits
// credits an AI tool. Runs from .github/workflows/no-ai-credit.yml.
import { execFileSync } from 'node:child_process';
import { findAiCredit, formatHits, isAiIdentity } from './ai-credit.mjs';

const { PR_TITLE = '', PR_BODY = '', BASE_SHA, HEAD_SHA } = process.env;
const problems = [];

for (const [label, text] of [['PR title', PR_TITLE], ['PR description', PR_BODY]]) {
  const hits = findAiCredit(text);
  if (hits.length) problems.push(`${label}:\n${formatHits(hits)}`);
}

if (BASE_SHA && HEAD_SHA) {
  const out = execFileSync(
    'git',
    ['log', `${BASE_SHA}..${HEAD_SHA}`, '--format=%h%x00%an%x00%ae%x00%cn%x00%ce%x00%B%x01'],
    { encoding: 'utf8' },
  );
  for (const rec of out.split('\x01')) {
    const [sha, an, ae, cn, ce, body] = rec.trim().split('\x00');
    if (!sha) continue;
    if (isAiIdentity(an, ae)) problems.push(`Commit ${sha}: author is "${an} <${ae}>"`);
    if (isAiIdentity(cn, ce)) problems.push(`Commit ${sha}: committer is "${cn} <${ce}>"`);
    const hits = findAiCredit(body);
    if (hits.length) problems.push(`Commit ${sha} message:\n${formatHits(hits)}`);
  }
}

if (problems.length) {
  console.error(`AI credit found. This repo never credits AI tools.\n\n${problems.join('\n\n')}`);
  process.exit(1);
}
console.log('No AI credit found.');
