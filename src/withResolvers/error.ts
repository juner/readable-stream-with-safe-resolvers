import type { InternalControllerState } from "../types/InternalControllerState.ts";

/**
 * Errors the stream and marks it as finished.
 */
export function error(this: InternalControllerState<unknown>, reason: unknown) {
  this.finalized = true;
  this.controller.error(reason);
}
