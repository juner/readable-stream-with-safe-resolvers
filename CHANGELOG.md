# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/).

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
