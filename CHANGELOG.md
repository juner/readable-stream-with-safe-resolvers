# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [2.0.1] - 2026-11-16

### Changed

- Simplified package distribution to pure ESM and lowered `engines.node` requirement to `>=22`.
- Restricted published package contents via `files` field in `package.json`.

### Fixed

- Removed dependency on `import("stream/web")` in `.d.ts` so types work in environments without `@types/node`.
- Fixed relative import extensions in emitted `.d.ts` files to use `.js` instead of `.ts`.
- Fixed CJS type resolution issue (`FalseESM`) by unifying exports as ESM.
- Fixed broken `homepage` and `bugs` URLs in `package.json`.
- Replaced non-ASCII characters in JSDoc comments and corrected `withResolvers` JSDoc description.

---

## [2.0.0] - 2026-01-30

### Added

- Added `withResolvers<T>()`, a low-level (unsafe) resolver that directly
  controls a `ReadableStream` without internal safety checks.

### Changed

- **Breaking:** `withSafeResolvers<T>()` methods now return `boolean`
  indicating whether the operation was applied.
- Operations after stream finalization can now be explicitly detected
  instead of being silent no-ops.

---

## [1.0.0] - 2025-11-15

### Added

- Initial release of `readable-stream-with-safe-resolvers`.
- Provides `withSafeResolvers<T>()` to create a `ReadableStream` with a safe, resolver-style interface.
- Safe operations:
  - `enqueue(chunk)` — pushes a value into the stream.
  - `close()` — closes the stream gracefully.
  - `error(reason)` — errors the stream.
  - All methods are **ignored after the stream is finalized** (via close, error, or consumer cancel).
- TypeScript support with `ReadableStreamSafeResolver<T>` type.
- Examples in README for:
  - Normal usage
  - Error handling
  - Safe multiple calls

### Changed

- N/A

### Fixed

- N/A

---

[1.0.0]: https://github.com/juner/readable-stream-with-safe-resolvers/releases/tag/v1.0.0
[2.0.0]: https://github.com/juner/readable-stream-with-safe-resolvers/releases/tag/v2.0.0
[2.0.1]: https://github.com/juner/readable-stream-with-safe-resolvers/releases/tag/v2.0.1
