# Commit Message Guide

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for standardized commit messages.

## Quick Start

### Using the Interactive Commit Tool

Instead of `git commit`, use:

```bash
npm run commit
```

This will launch an interactive CLI that guides you through creating a proper commit message.

### Manual Commit Format

If you prefer to write commits manually:

```bash
git commit -m "type(scope): subject"
```

## Commit Types

| Type | Description | Example |
|------|-------------|---------|
| **feat** | New feature | `feat: add user export functionality` |
| **fix** | Bug fix | `fix: resolve cache invalidation issue` |
| **refactor** | Code refactoring | `refactor: simplify API client structure` |
| **perf** | Performance improvement | `perf: optimize user list query` |
| **docs** | Documentation | `docs: update API integration guide` |
| **style** | Code style (formatting) | `style: fix indentation in useUser hook` |
| **test** | Tests | `test: add tests for useConnectAttendance` |
| **build** | Build system/dependencies | `build: upgrade React Query to v5` |
| **ci** | CI/CD changes | `ci: add GitHub Actions workflow` |
| **chore** | Other changes | `chore: update dependencies` |
| **revert** | Revert previous commit | `revert: revert feat: add user export` |

## Scope (Optional)

Scope indicates what part of the codebase was changed:

- `api` - API client changes
- `hooks` - Hook changes
- `components` - Component changes
- `auth` - Authentication related
- `ui` - UI components
- `types` - Type definitions

**Examples:**
```bash
feat(hooks): add useConnectAttendance hook
fix(api): correct authentication header injection
refactor(components): convert UserDialog to arrow function
```

## Subject

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Keep it concise (< 72 characters)

**Good:**
```bash
feat: add user export functionality
fix: resolve pagination bug in user table
refactor: simplify query key structure
```

**Bad:**
```bash
feat: Added user export functionality.
fix: Fixed the pagination bug
refactor: Simplifying Query Keys
```

## Body (Optional)

Add more details if needed:

```bash
git commit -m "feat: add user export functionality" -m "
- Export users to CSV format
- Include all user attributes
- Add export button to user management page
"
```

Or with the interactive tool:
```bash
npm run commit
# Then add details when prompted
```

## Breaking Changes

For breaking changes, use `BREAKING CHANGE:` in the body or add `!` after type:

```bash
feat!: change API response format

BREAKING CHANGE: User API now returns 'results' instead of 'data'
```

## Examples

### Simple Feature
```bash
feat: add loading state to group selector
```

### Bug Fix with Details
```bash
fix(hooks): prevent duplicate API calls in useUsers

The hook was making multiple calls when params changed rapidly.
Now debouncing the query to prevent unnecessary requests.
```

### Refactoring
```bash
refactor(api): remove service layer on frontend

Backend already has service layer with business logic.
Frontend now directly calls API endpoints via lib/api.ts
```

### Documentation
```bash
docs: add commit message guide
```

## Automated Changelog

When you're ready to create a release:

```bash
# Patch release (1.0.0 → 1.0.1)
npm run release

# Minor release (1.0.0 → 1.1.0)
npm run release:minor

# Major release (1.0.0 → 2.0.0)
npm run release:major
```

This will:
1. Bump version in `package.json`
2. Update `CHANGELOG.md` with all commits since last release
3. Create a git tag
4. Commit the changes

## Commit Message Validation

All commits are validated using `commitlint`. Invalid commits will be rejected with a helpful error message:

```bash
❌ type must be one of [feat, fix, docs, ...]
❌ subject may not be empty
✅ feat: add user export functionality
```

## Tips

1. **Use `npm run commit`** - Easiest way to ensure proper format
2. **Commit often** - Small, focused commits are better than large ones
3. **Be descriptive** - Help your future self understand what changed
4. **Group related changes** - One commit per logical change
5. **Reference issues** - Add issue numbers in body if applicable

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Commitlint](https://commitlint.js.org/)

---

**Need help?** Just run `npm run commit` and follow the prompts! 🚀

