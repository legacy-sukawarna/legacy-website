# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.1.0 (2025-11-24)


### ✨ Features

* update to modern stack + cleanup ([44f6895](https://github.com/yosuahalim/legacy-website/commit/44f6895e38dba741e9347e7555bc7f6f354b5079))


### 🐛 Bug Fixes

* **logut function:** fix logout function so it won't wait redirect ([a0e0acc](https://github.com/yosuahalim/legacy-website/commit/a0e0acc435ad89f6075a44e40ff0e2f4401a15b4))

## 1.0.0 (2025-11-09)

### ✨ Features

* Initial release with refactored hooks pattern
* Add `lib/api.ts` - Centralized API client
* Add `hooks/useUser.ts` - User management hooks
* Add `hooks/useGroup.ts` - Group management hooks
* Add `hooks/useConnectAttendance.ts` - Attendance tracking hooks

### ♻️ Code Refactoring

* Refactor API integration to follow SOLID principles
* Remove unnecessary service layer on frontend
* Simplify query key structure (inline keys)
* Convert hooks to ES6 arrow functions
* Remove redundant cache invalidation in components

### 📚 Documentation

* Add `AGENTS.md` - Comprehensive AI assistant guide
* Add `README_REFACTORING.md` - Refactoring documentation
* Update workspace rules with pragmatic patterns
