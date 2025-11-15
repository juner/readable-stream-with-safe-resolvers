import type { InternalControllerState } from "./types/InternalControllerState.ts";

/**
 * Errors the stream and marks it as finished.
 * Safe to call multiple times and ignored if the stream is finalized.
 */
export function error(this: InternalControllerState<unknown>, reason: unknown) {
  if (this.finalized) return;
  this.finalized = true;
  this.controller.error(reason);
}
