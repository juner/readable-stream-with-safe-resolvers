import type { ReadableStream } from "./ReadableStream.ts";
/**
 * A low-level resolver-style handle for externally controlling a `ReadableStream`.
 *
 * This resolver exposes direct access to stream operations without any
 * internal safety checks. Calling `enqueue`, `close`, or `error` after the
 * stream has been finalized (closed, errored, or canceled) may throw,
 * depending on the underlying stream implementation.
 *
 * Unlike `ReadableStreamSafeResolver`, this type does not guard against
 * invalid state transitions. The caller is responsible for ensuring that
 * operations are performed only while the stream is active.
 *
 * Provided properties:
 * - `stream` — The underlying `ReadableStream`.
 * - `completed` — Indicates whether the stream has been finalized.
 *
 * Provided methods:
 * - `enqueue(chunk)` — Push a new chunk into the stream.
 * - `close()` — Close the stream gracefully.
 * - `error(reason)` — Terminate the stream with an error.
 */
export type ReadableStreamResolver<T> = {
  stream: ReadableStream<T>
  enqueue: (chunk: T) => void
  close: () => void
  error: (reason: unknown) => void
  /**
   * Whether the stream has been finalized (closed, errored, or canceled).
   *
   * This flag can be used by the caller to avoid invalid operations,
   * but it is not enforced internally.
   */
  get completed(): boolean
};
