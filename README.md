# readable-stream-with-safe-resolvers

[![npm version](https://img.shields.io/npm/v/readable-stream-with-safe-resolvers.svg)](https://www.npmjs.com/package/readable-stream-with-safe-resolvers)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)

A small utility to create a **ReadableStream** with a safe, resolver-style interface, similar to `Promise.withResolvers()`.  
It allows you to push values into a stream, close it, or error it from outside, while automatically ignoring any operations after the stream has been finalized.

## Installation

```bash
npm install readable-stream-with-safe-resolvers
# or
yarn add readable-stream-with-safe-resolvers
```

## Usage

```ts
import { withSafeResolvers } from "readable-stream-with-safe-resolvers";

async function example() {
  const { stream, enqueue, close, error } = withSafeResolvers<number>();

  // Push values
  enqueue(1);
  enqueue(2);

  // Close the stream
  close();

  // Reading from the stream
  const result = [];
  for await (const value of stream) {
    result.push(value);
  }

  console.log(result); // → [1, 2]
}

example();
```

## API

### `withSafeResolvers<T>()`

Returns an object containing:

- `stream: ReadableStream<T>` — the underlying stream.
- `enqueue(chunk: T)` — pushes a new chunk into the stream. Ignored after the stream is finalized.
- `close()` — gracefully closes the stream. Ignored if already finalized.
- `error(reason: unknown)` — terminates the stream with an error. Ignored if already finalized.

**Important:**  
Once the stream is finalized—via `close()`, `error()`, or consumer `cancel()`—all subsequent calls to `enqueue`, `close`, or `error` are silently ignored.

## Example: Error Handling

```ts
import { withSafeResolvers } from "readable-stream-with-safe-resolvers";

async function exampleError() {
  const { stream, enqueue, error } = withSafeResolvers<number>();

  enqueue(10);
  enqueue(20);

  error(new Error("Something went wrong"));

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
close();
enqueue(2);    // ignored
close();       // ignored
error(new Error("oops")); // ignored
```

This demonstrates that operations after the stream is finalized are safe and have no effect.

## When to Use

- You want a **pushable stream** controlled from outside the consumer loop.
- You want to avoid **errors from multiple close/error/enqueue calls**.
- Useful for **async generators, streaming APIs, or event emitters** that need a stream interface.

## License

MIT
