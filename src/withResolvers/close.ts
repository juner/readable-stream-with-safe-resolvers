import type { InternalControllerState } from "../types/InternalControllerState.ts";

/**
 * Closes the stream gracefully.
 */
export function close(this: InternalControllerState<unknown>) {
  this.finalized = true;
  this.controller.close();
}
