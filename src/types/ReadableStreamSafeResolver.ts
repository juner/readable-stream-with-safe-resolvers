import type { ReadableStream } from "./ReadableStream.ts";
/**
 * A safe, resolver-style handle for externally controlling a `ReadableStream`.
 *
 * Unlike using a raw `ReadableStreamDefaultController`, this helper prevents
 * common errors by automatically ignoring any operation after the stream
 * has been finalized (closed, errored, or canceled).
 *
 * Provided methods:
 * - `enqueue(chunk)` — Push a new chunk into the stream. Ignored after the stream is finalized.
 * - `close()` — Close the stream gracefully. Ignored if already finalized.
 * - `error(reason)` — Terminate the stream with an error. Ignored if already finalized.
 */
export type ReadableStreamSafeResolver<T> = {
  stream: ReadableStream<T>;
  enqueue: (chunk: T) => void;
  close: () => void;
  error: (reason: unknown) => void;
};