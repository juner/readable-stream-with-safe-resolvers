type ReadableStream<T> = import("stream/web").ReadableStream<T>;

type ReadableStreamResolver<T> = {
  stream: ReadableStream<T>;
  enqueue: (chunk: T) => void;
  close: () => void;
  error: (reason: unknown) => void;
}

type InternalControllerState<T> = {
  controller: ReadableStreamDefaultController<T>;
  done: boolean;
}

export function withResolvers<T = unknown>(): ReadableStreamResolver<T> {

  const instance: InternalControllerState<T> = {
    controller: null!,
    done: false,
  };

  const stream = new globalThis.ReadableStream<T>(
    new DeferredSource<T>(instance)
  ) as ReadableStream<T>;

  return {
    stream,
    enqueue: enqueue.bind(instance),
    close: close.bind(instance),
    error: error.bind(instance),
  };
}

export class DeferredSource<T> implements UnderlyingDefaultSource<T> {
  #state: InternalControllerState<T>;
  constructor(state: InternalControllerState<T>) {
    this.#state = state;
  }
  start(controller: ReadableStreamDefaultController<T>) {
    this.#state.controller = controller;
  }
  cancel() {
    this.#state.done = true;
  }
}

function enqueue<T>(this: InternalControllerState<T>, chunk: T) {
  if (!this.done) this.controller.enqueue(chunk);
}

function close(this: InternalControllerState<unknown>) {
  if (this.done) return;
  this.done = true;
  this.controller.close();
}

function error(this: InternalControllerState<unknown>, reason: unknown) {
  if (this.done) return;
  this.done = true;
  this.controller.error(reason);
}
