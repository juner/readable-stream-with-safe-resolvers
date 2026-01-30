import type { InternalControllerState } from "../types/InternalControllerState.ts";

/**
 * Enqueues a new chunk into the stream.
 * Ignored if the stream has already been finalized.
 * @returns Returns true if processed, false otherwise.
 */
export function enqueue<T>(this: InternalControllerState<T>, chunk: T) {
  if (this.finalized) return false;
  this.controller.enqueue(chunk);
  return true;
}
