import type { InternalControllerState } from "./types/InternalControllerState.ts";

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
