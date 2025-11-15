/**
 * Internal controller state shared between the resolver and the underlying
 * source implementation. Not exposed publicly.
 */
export type InternalControllerState<T> = {
  controller: ReadableStreamDefaultController<T>;
  finalized: boolean;
};