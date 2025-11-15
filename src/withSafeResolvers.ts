type ReadableStream<T> = import("stream/web").ReadableStream<T>;

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

/**
 * Internal controller state shared between the resolver and the underlying
 * source implementation. Not exposed publicly.
 */
type InternalControllerState<T> = {
  controller: ReadableStreamDefaultController<T>;
  finalized: boolean;
};

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
 * @example
 * const { stream, enqueue, close } = withSafeResolvers<number>();
 *
 * enqueue(1);
 * enqueue(2);
 * close();
 *
 * console.log(await Array.fromAsync(stream)); // → [1, 2]
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

/**
 * Internal underlying source used by `withSafeResolvers()`.
 *
 * Its only responsibilities are:
 * - capturing the controller during `start()`
 * - marking the stream as finished when the consumer cancels it
 */
export class DeferredSource<T> implements UnderlyingDefaultSource<T> {
  #state: InternalControllerState<T>;

  constructor(state: InternalControllerState<T>) {
    this.#state = state;
  }

  start(controller: ReadableStreamDefaultController<T>) {
    this.#state.controller = controller;
  }

  cancel() {
    this.#state.finalized = true;
  }
}

/**
 * Enqueues a new chunk into the stream.
 * Ignored if the stream has already been finalized.
 */
function enqueue<T>(this: InternalControllerState<T>, chunk: T) {
  if (!this.finalized) this.controller.enqueue(chunk);
}

/**
 * Closes the stream gracefully.
 * Safe to call multiple times and ignored if the stream is finalized.
 */
function close(this: InternalControllerState<unknown>) {
  if (this.finalized) return;
  this.finalized = true;
  this.controller.close();
}

/**
 * Errors the stream and marks it as finished.
 * Safe to call multiple times and ignored if the stream is finalized.
 */
function error(this: InternalControllerState<unknown>, reason: unknown) {
  if (this.finalized) return;
  this.finalized = true;
  this.controller.error(reason);
}