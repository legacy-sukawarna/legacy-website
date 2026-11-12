#!/usr/bin/env node
// PreToolUse hook: hard-blocks any commit, push or pull request that credits
// an AI tool. Exit code 2 rejects the tool call and shows stderr to the agent.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { findAiCredit, formatHits, isAiIdentity } from './ai-credit.mjs';

// GitHub MCP tools that write a commit message or a PR title/body, and the
// input fields that carry the text. Comment tools are deliberately left out.
const MCP_FIELDS = {
  create_pull_request: ['title', 'body'],
  update_pull_request: ['title', 'body'],
  create_pull_request_with_copilot: ['title', 'problem_statement'],
  merge_pull_request: ['commit_title', 'commit_message'],
  push_files: ['message'],
  create_or_update_file: ['message'],
  delete_file: ['message'],
};

const GIT_WRITES_MESSAGE = /\bgit\b[^\n;&|]*\b(?:commit|merge|tag|revert|cherry-pick|rebase|am|notes)\b/;
const GIT_COMMITS = /\bgit\b[^\n;&|]*\b(?:commit|merge|revert|cherry-pick|rebase|am)\b/;
const GIT_PUSH = /\bgit\b[^\n;&|]*\bpush\b/;
const GH_PR_WRITE = /\bgh\s+(?:pr\s+(?:create|edit|merge)|api\b[^\n]*\bpulls\b)/;
const FILE_FLAG = /(?:\s-F|--file|--body-file|--template)(?:\s+|=)("[^"]+"|'[^']+'|[^\s;&|]+)/g;

function block(what, detail) {
  process.stderr.write(
    `BLOCKED: ${what} gives AI credit, which this repo never allows.\n${detail}\n\n` +
      'Remove every AI co-author trailer, session line, "Generated with ..." footer and\n' +
      'Claude link, commit as Ken, then try again. Do not work around this hook.\n' +
      'Rule: AGENTS.md > "No AI credit". Detector: .claude/hooks/ai-credit.mjs\n',
  );
  process.exit(2);
}

function git(cwd, args) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
}

function checkIdentity(cwd) {
  for (const who of ['GIT_AUTHOR_IDENT', 'GIT_COMMITTER_IDENT']) {
    const m = git(cwd, ['var', who]).match(/^(.*) <([^>]*)>/);
    if (m && isAiIdentity(m[1], m[2])) {
      block(
        'The git identity',
        `  - ${who} is "${m[1]} <${m[2]}>"\n` +
          'Run .claude/hooks/git-identity.sh (or set git config user.name / user.email to Ken) first.',
      );
    }
  }
}

function checkUnpushedCommits(cwd) {
  // Every commit reachable from HEAD that no origin branch has yet.
  const out = git(cwd, ['log', 'HEAD', '--not', '--remotes=origin', '--format=%h%x00%an%x00%ae%x00%cn%x00%ce%x00%B%x01']);
  const problems = [];
  for (const rec of out.split('\x01')) {
    const [sha, an, ae, cn, ce, body] = rec.trim().split('\x00');
    if (!sha) continue;
    if (isAiIdentity(an, ae)) problems.push(`  - ${sha} author is "${an} <${ae}>"`);
    if (isAiIdentity(cn, ce)) problems.push(`  - ${sha} committer is "${cn} <${ce}>"`);
    const hits = findAiCredit(body);
    if (hits.length) problems.push(`  ${sha} message:\n${formatHits(hits)}`);
  }
  if (problems.length) {
    block('A commit you are about to push', `${problems.join('\n')}\nRewrite those commits (amend or rebase) before pushing.`);
  }
}

function checkBash(command, cwd) {
  const writesText = GIT_WRITES_MESSAGE.test(command) || GH_PR_WRITE.test(command);
  if (writesText) {
    const hits = findAiCredit(command);
    if (hits.length) block('This command', formatHits(hits));
    for (const m of command.matchAll(FILE_FLAG)) {
      const file = m[1].replace(/^["']|["']$/g, '');
      if (file === '-') continue;
      let text = '';
      try {
        text = readFileSync(resolve(cwd, file), 'utf8');
      } catch {
        continue;
      }
      const fileHits = findAiCredit(text);
      if (fileHits.length) block(`The message file ${file}`, formatHits(fileHits));
    }
  }
  if (GIT_COMMITS.test(command)) checkIdentity(cwd);
  if (GIT_PUSH.test(command)) checkUnpushedCommits(cwd);
}

function checkMcp(toolName, input) {
  const short = toolName.split('__').pop();
  const fields = MCP_FIELDS[short];
  if (!fields) return;
  for (const field of fields) {
    const hits = findAiCredit(input[field]);
    if (hits.length) block(`The ${field} passed to ${short}`, formatHits(hits));
  }
}

let payload;
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}
const { tool_name: toolName = '', tool_input: input = {}, cwd = process.cwd() } = payload;
if (toolName === 'Bash') checkBash(String(input.command ?? ''), cwd);
else if (/^mcp__.*github/i.test(toolName)) checkMcp(toolName, input);
process.exit(0);
