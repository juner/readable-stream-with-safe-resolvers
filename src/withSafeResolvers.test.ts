import { describe, test } from "vitest";
import { withSafeResolvers } from "./withSafeResolvers.ts";

describe("simple use", () => {
  test.concurrent("enqueue and close", async ({ expect }) => {
    const { enqueue, stream, close } = withSafeResolvers<number>();
    const executed = (async () => {
      enqueue(1);
      await timeout(100);
      enqueue(2);
      await timeout(100);
      close();
    })();
    await expect(Array.fromAsync(stream)).resolves.toEqual([
      1,
      2,
    ]);
    await expect(executed).resolves.toBeUndefined();
  });
  test.concurrent("error", async ({ expect }) => {
    const { enqueue, stream, error } = withSafeResolvers<number>();
    const executed = (async () => {
      enqueue(3);
      await timeout(100);
      error(new Error("error"));
    })();
    await expect(Array.fromAsync(stream)).rejects.toThrowError("error");
    await expect(executed).resolves.toBeUndefined();
  });
  test.concurrent("for of", async ({ expect }) => {
    const { enqueue, stream } = withSafeResolvers<number>();
    const executed = (async () => {
      enqueue(4);
      await timeout(100);
      enqueue(5);
      await timeout(100);
      enqueue(6);
    })();
    for await (const num of stream) {
      if (num >= 5) break;
      expect(num).toEqual(4);
    }
    await expect(executed).resolves.toBeUndefined();
  });
});

describe("safe stop call", () => {
  test.concurrent("enqueue", async ({ expect }) => {
    const { enqueue, stream, close } = withSafeResolvers<number>();
    const executed = (async () => {
      enqueue(1);
      await timeout(100);
      close();
      await timeout(100);
      enqueue(2);
    })();
    await expect(Array.fromAsync(stream)).resolves.toEqual([
      1,
    ]);
    await expect(executed).resolves.toBeUndefined();
  });
  test.concurrent("close", async ({ expect }) => {
    const { stream, close } = withSafeResolvers<number>();
    const executed = (async () => {
      close();
      await timeout(100);
      close();
    })();
    await expect(Array.fromAsync(stream)).resolves.toEqual([]);
    await expect(executed).resolves.toBeUndefined();
  });
  test.concurrent("error", async ({ expect }) => {
    const { enqueue, stream, close, error } = withSafeResolvers<number>();
    const executed = (async () => {
      enqueue(4);
      close();
      error(new Error("error"));
    })();
    await expect(Array.fromAsync(stream)).resolves.toEqual([4]);
    await expect(executed).resolves.toBeUndefined();
  });
});

async function timeout(milliseconds?: number, options?: {
  signal?: AbortSignal
}) {
  const { resolve, promise } = Promise.withResolvers<void>();
  const clear = setTimeout(resolve, milliseconds);
  options?.signal?.addEventListener("abort", abort);
  try {
    return await promise;
  }
  finally {
    options?.signal?.removeEventListener("abort", abort);
  }
  function abort() {
    clearTimeout(clear);
    resolve();
  }
}
