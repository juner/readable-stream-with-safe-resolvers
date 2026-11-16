import { close, enqueue, error } from "./withResolvers/index.js";
import { DeferredSource } from "./DeferredSource.js";
import type { ReadableStream, ReadableStreamResolver, InternalControllerState } from "./types/index.js";

/**
 * Creates a `ReadableStream` together with a low-level set of resolver-like
 * methods for external control.
 *
 * This function is conceptually similar to `Promise.withResolvers()`,
 * but for streams: it produces both the stream and a small imperative
 * interface for pushing values or completing it.
 *
 * Unlike `withSafeResolvers()`, this function does not perform internal
 * safety checks. Calling `enqueue()`, `close()`, or `error()` after the
 * stream is finalized (via `close()`, `error()`, or consumer cancellation)
 * may throw.
 *
 * @example ```js
 * const { stream, enqueue, close } = withResolvers<number>();
 *
 * enqueue(1);
 * enqueue(2);
 * close();
 *
 * console.log(await Array.fromAsync(stream)); // -> [1, 2]
 * ```
 */
export function withResolvers<T = unknown>(): ReadableStreamResolver<T> {
  const state: InternalControllerState<T> = {
    controller: null!,
    finalized: false,
  };

  const stream = new globalThis.ReadableStream<T>(
    new DeferredSource<T>(state),
  ) as ReadableStream<T>;

  return {
    stream,
    enqueue: enqueue.bind(state),
    close: close.bind(state),
    error: error.bind(state),
    get completed() { return state.finalized; },
  };
}
