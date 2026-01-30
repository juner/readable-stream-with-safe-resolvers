# readable-stream-with-safe-resolvers

[![npm version](https://img.shields.io/npm/v/readable-stream-with-safe-resolvers.svg)](https://www.npmjs.com/package/readable-stream-with-safe-resolvers)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)

A small utility to create a **ReadableStream** with a resolver-style interface,
similar to `Promise.withResolvers()`.

This library provides both a low-level resolver and a safe, defensive variant;
the safe variant never throws due to invalid stream state.

## Installation

```bash
npm install readable-stream-with-safe-resolvers
# or
yarn add readable-stream-with-safe-resolvers
```

## Resolvers

This library provides two resolver variants:

### `withResolvers<T>()`

A low-level resolver that directly controls a `ReadableStream`.

- Operations do **not** perform internal safety checks
- Calling methods after the stream is finalized may throw
- Intended for strict, controller-like use cases

Returned methods:

- `enqueue(chunk: T): void`
- `close(): void`
- `error(reason: unknown): void`
- `completed: boolean` — whether the stream has been finalized
  This flag can be used to avoid invalid operations, but it is not enforced internally.

---

### `withSafeResolvers<T>()`

A defensive resolver that safely ignores invalid operations.

- All operations are safe and never throw due to stream state
- Each method returns a boolean indicating whether it was applied

Returned methods:

- `enqueue(chunk: T): boolean`
- `close(): boolean`
- `error(reason: unknown): boolean`

## Usage (Safe)

```ts
import { withSafeResolvers } from "readable-stream-with-safe-resolvers";

async function example() {
  const { stream, enqueue, close, error } = withSafeResolvers<number>();

  // Push values
  enqueue(1);
  // -> true
  enqueue(2);
  // -> true

  // Close the stream
  close();
  // -> true

  // Reading from the stream
  const result = [];
  for await (const value of stream) {
    result.push(value);
  }

  console.log(result); // → [1, 2]
}

example();
```

In typical usage, the return value can be ignored unless you need to
detect whether the stream has already been finalized.

## Usage (Unsafe)

```ts
import { withResolvers } from "readable-stream-with-safe-resolvers";

const { stream, enqueue, close, completed } = withResolvers<number>();

if (!completed) {
  enqueue(1);
  close();
}
```

Calling methods after the stream is finalized may throw.

## When to Use `withSafeResolvers`

- You want safety over strict control
- Multiple async contexts may call `enqueue` / `close`
- You want to avoid runtime errors from invalid stream state

## When to Use `withResolvers`

- You want strict, controller-like behavior
- Stream lifecycle is fully controlled in one place
- You prefer errors over silent ignoring

The caller is responsible for avoiding invalid operations.

## API

### `withSafeResolvers<T>()`

Returns an object containing:

- `stream: ReadableStream<T>` — the underlying stream.
- `enqueue(chunk: T): boolean` — pushes a new chunk into the stream.  
  Returns `false` if the stream has already been finalized.
- `close(): boolean` — gracefully closes the stream.  
  Returns `false` if already finalized.
- `error(reason: unknown): boolean` — terminates the stream with an error.  
  Returns `false` if already finalized.

### Important (Safe Resolver)

Once the stream is finalized—via `close()`, `error()`, or consumer `cancel()`—
all subsequent calls to `enqueue`, `close`, or `error` are silently ignored
and return `false`.

### `withResolvers<T>()`

Returns an object containing:

- `stream: ReadableStream<T>` — the underlying stream.
- `enqueue(chunk: T): void` — pushes a new chunk into the stream.
- `close(): void` — closes the stream.
- `error(reason: unknown): void` — terminates the stream with an error.
- `completed: boolean` — whether the stream has been finalized.

No internal safety checks are performed.  
The caller is responsible for avoiding invalid operations.

## Example: Error Handling

```ts
import { withSafeResolvers } from "readable-stream-with-safe-resolvers";

async function exampleError() {
  const { stream, enqueue, error } = withSafeResolvers<number>();

  enqueue(10);
  // -> true
  enqueue(20);
  // -> true

  error(new Error("Something went wrong"));
  // -> true

  try {
    for await (const value of stream) {
      console.log(value);
    }
  } catch (err) {
    console.error(err); // → Error: Something went wrong
  }
}

exampleError();
```

## Example: Safe Multiple Calls

```ts
const { stream, enqueue, close, error } = withSafeResolvers<number>();

enqueue(1);
// -> true
close();
// -> true
enqueue(2);    // ignored
// -> false
close();       // ignored
// -> false
error(new Error("oops")); // ignored
// -> false
```

This demonstrates that operations after the stream is finalized are safe,
idempotent, and never throw due to invalid stream state.

## Typical Use Cases

- Creating pushable streams controlled outside the consumer loop
- Wrapping async generators or event emitters as streams
- Building streaming APIs that need explicit lifecycle control

## License

MIT
