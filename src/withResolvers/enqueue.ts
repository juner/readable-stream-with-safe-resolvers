import type { InternalControllerState } from "../types/InternalControllerState.ts";

/**
 * Enqueues a new chunk into the stream.
 */
export function enqueue<T>(this: InternalControllerState<T>, chunk: T) {
  this.controller.enqueue(chunk);
}
