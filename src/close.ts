import type { InternalControllerState } from "./types/InternalControllerState.ts";

/**
 * Closes the stream gracefully.
 * Safe to call multiple times and ignored if the stream is finalized.
 */
export function close(this: InternalControllerState<unknown>) {
  if (this.finalized) return;
  this.finalized = true;
  this.controller.close();
}
