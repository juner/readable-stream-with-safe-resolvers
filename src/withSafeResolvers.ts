import { close } from "./close.ts";
import { DeferredSource } from "./DeferredSource.ts";
import { enqueue } from "./enqueue.ts";
import { error } from "./error.ts";
import type { ReadableStream, ReadableStreamSafeResolver, InternalControllerState } from "./types/index.ts";

/**
 * Creates a `ReadableStream` together with a safe set of resolver-like
 * methods for external control.
 *
 * This function is conceptually similar to `Promise.withResolvers()`,
 * but for streams: it produces both the stream and a small imperative
 * interface for pushing values or completing it.
 *
 * Once the stream is finalized—via `close()`, `error()`, or consumer
 * cancellation—any further calls to `enqueue()`, `close()`, or `error()`
 * are silently ignored.
 *
 * @example ```js
 * const { stream, enqueue, close } = withSafeResolvers<number>();
 *
 * enqueue(1);
 * enqueue(2);
 * close();
 *
 * console.log(await Array.fromAsync(stream)); // → [1, 2]
 * ```
 */
export function withSafeResolvers<T = unknown>(): ReadableStreamSafeResolver<T> {
  const state: InternalControllerState<T> = {
    controller: null!,
    finalized: false,
  };

  const stream = new globalThis.ReadableStream<T>(
    new DeferredSource<T>(state)
  ) as ReadableStream<T>;

  return {
    stream,
    enqueue: enqueue.bind(state),
    close: close.bind(state),
    error: error.bind(state),
  };
}


