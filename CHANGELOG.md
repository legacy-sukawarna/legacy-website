# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/yosuahalim/legacy-website/compare/v1.1.0...v2.0.0) (2025-12-20)


### 🐛 Bug Fixes

* fix bug get all connect-member ([e3f1626](https://github.com/yosuahalim/legacy-website/commit/e3f1626969ca9eaab0b29a2bf9efb342b989e9b2))
* Move clearUser() call ([3fd64d9](https://github.com/yosuahalim/legacy-website/commit/3fd64d9bbc4b15397601312847d5be44a7e2fff2))
* update pagination display in Connect ([4f31792](https://github.com/yosuahalim/legacy-website/commit/4f31792097e6097e61b55babde3b1ac26cb49dcd))


### ✨ Features

* add attendance report functionality and integrate recharts for data visualization ([bb8d77a](https://github.com/yosuahalim/legacy-website/commit/bb8d77a20c598bf7c91ed301047356be182eed05))


### ♻️ Code Refactoring

* update dashboard layout and enhance user experience ([50a8b99](https://github.com/yosuahalim/legacy-website/commit/50a8b991c23c2de46a07213141baf70ae430eac2))

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
