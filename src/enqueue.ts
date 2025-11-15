import type { InternalControllerState } from "./types/InternalControllerState.ts";

/**
 * Enqueues a new chunk into the stream.
 * Ignored if the stream has already been finalized.
 */
export function enqueue<T>(this: InternalControllerState<T>, chunk: T) {
  if (!this.finalized) this.controller.enqueue(chunk);
}
