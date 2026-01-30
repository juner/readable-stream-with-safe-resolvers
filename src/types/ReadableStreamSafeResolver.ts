import type { ReadableStream } from "./ReadableStream.ts";
/**
 * A safe, resolver-style handle for externally controlling a `ReadableStream`.
 *
 * Unlike using a raw `ReadableStreamDefaultController`, this helper prevents
 * common errors by automatically ignoring any operation after the stream
 * has been finalized (closed, errored, or canceled).
 *
 * Each operation returns a boolean indicating whether it was successfully
 * applied:
 * - `true`  — the operation was accepted and applied
 * - `false` — the stream was already finalized and the operation was ignored
 */
export type ReadableStreamSafeResolver<T> = {
  stream: ReadableStream<T>
  /**
   * Push a new chunk into the stream.
   * @param chunk
   * @returns `false` if the stream has already been finalized.
   */
  enqueue: (chunk: T) => boolean
  /**
   * Close the stream gracefully.
   * @returns `false` if the stream is already finalized.
   */
  close: () => boolean
  /**
   * Terminate the stream with an error.
   * @param reason
   * @returns `false` if the stream is already finalized.
   */
  error: (reason: unknown) => boolean
};
