// Detects AI credit in commit messages and PR titles/bodies.
// Shared by the PreToolUse hook (block-ai-credit.mjs) and the PR check
// (.github/workflows/no-ai-credit.yml). Ken's rule: no AI tool is ever
// credited as author, co-author, or generator of work in this repo.

const AI =
  String.raw`claude|anthropic|copilot|codex|openai|chat\s*gpt|gpt-?\d|gemini|cursor\s+(?:ai|agent|ide)|devin|aider|windsurf|codeium|tabnine|amazon\s*q|an?\s+(?:ai|llm)|(?:ai|llm)\s+(?:assistant|agent|tool|model)`;

const RULES = [
  {
    // Co-Authored-By:, Assisted-by:, Signed-off-by:, Generated-by: ... naming an AI
    name: 'AI trailer',
    re: new RegExp(String.raw`^[ \t>]*[A-Za-z][\w-]*-by:[^\n]*\b(?:${AI})\b`, 'gim'),
  },
  {
    name: 'AI session trailer',
    re: /^[ \t>]*(?:claude|ai|llm|agent)[\w-]*-session:/gim,
  },
  {
    name: 'Anthropic noreply address',
    re: /noreply@anthropic\.com/gi,
  },
  {
    // "Generated with [Claude Code]", "Written by Copilot", "Created using ChatGPT" ...
    name: '"generated with AI" credit',
    re: new RegExp(
      String.raw`\b(?:generated|created|written|authored|co-?authored|made|built|produced|assisted|drafted|powered)\s+(?:with|by|using|via|through|in)\s+(?:the\s+help\s+of\s+)?[\s\[(*_\x60"']*(?:(?:github|google|microsoft)\s+)?(?:${AI})\b`,
      'gi',
    ),
  },
  {
    // Footer and session links: claude.ai/code, claude.ai/code/session_..., claude.com/claude-code
    name: 'Claude link',
    re: /\bclaude\.(?:ai|com)\/[^\s)\]>"']*/gi,
  },
  {
    name: 'anthropic.com Claude Code link',
    re: /\banthropic\.com\/(?:claude-code|claude)[^\s)\]>"']*/gi,
  },
  {
    // Hidden marker the Claude project harness puts at the top of a PR body.
    name: 'Claude project attribution marker',
    re: /<!--\s*claude[\w-]*attribution[^\n]*?-->/gi,
  },
  {
    // "_Requested by **Ken** · [project thread](...)_" header from the same harness.
    name: '"Requested by" project header',
    re: /^[ \t>]*[_*]*Requested by\b[^\n]*$/gim,
  },
];

/** Returns [{rule, match}] for every AI credit found in `text`. */
export function findAiCredit(text) {
  if (typeof text !== 'string' || text === '') return [];
  const hits = [];
  for (const { name, re } of RULES) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) {
      hits.push({ rule: name, match: m[0].trim().slice(0, 120) });
    }
  }
  return hits;
}

/** True when a git author/committer identity belongs to an AI tool. */
export function isAiIdentity(name = '', email = '') {
  return (
    /noreply@anthropic\.com/i.test(email) ||
    /^(?:claude|claude code|copilot|codex|chatgpt|openai)$/i.test(name.trim())
  );
}

export function formatHits(hits) {
  return hits.map((h) => `  - ${h.rule}: ${JSON.stringify(h.match)}`).join('\n');
}
