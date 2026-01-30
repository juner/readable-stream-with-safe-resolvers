import type { InternalControllerState } from "../types/InternalControllerState.ts";

/**
 * Closes the stream gracefully.
 * Safe to call multiple times and ignored if the stream is finalized.
 * @returns Returns true if processed, false otherwise.
 */
export function close(this: InternalControllerState<unknown>) {
  if (this.finalized) return false;
  this.finalized = true;
  this.controller.close();
  return true;
}
