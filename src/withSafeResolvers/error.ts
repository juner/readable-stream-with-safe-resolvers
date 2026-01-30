import type { InternalControllerState } from "../types/InternalControllerState.ts";

/**
 * Errors the stream and marks it as finished.
 * Safe to call multiple times and ignored if the stream is finalized.
 * @returns Returns true if processed, false otherwise.
 */
export function error(this: InternalControllerState<unknown>, reason: unknown) {
  if (this.finalized) return false;
  this.finalized = true;
  this.controller.error(reason);
  return true;
}
