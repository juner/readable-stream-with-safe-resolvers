import { describe, test } from "vitest";
import { withResolvers } from "./withResolvers.ts";

describe("simple use", () => {
  test.concurrent("enqueue and close", async ({ expect }) => {
    const resolvers = withResolvers<number>();
    const { enqueue, stream, close } = resolvers;
    expect(resolvers.completed).toBe(false);
    const executed = (async () => {
      enqueue(1);
      await timeout(100);
      enqueue(2);
      await timeout(100);
      close();
    })();
    expect(resolvers.completed).toBe(false);
    await expect(Array.fromAsync(stream)).resolves.toEqual([
      1,
      2,
    ]);
    expect(resolvers.completed).toBe(true);
    await expect(executed).resolves.toBeUndefined();
  });
  test.concurrent("error", async ({ expect }) => {
    const resolvers = withResolvers<number>();
    const { enqueue, stream, error } = resolvers;
    expect(resolvers.completed).toBe(false);
    const executed = (async () => {
      enqueue(3);
      await timeout(100);
      error(new Error("error"));
    })();
    expect(resolvers.completed).toBe(false);
    await expect(Array.fromAsync(stream)).rejects.toThrowError("error");
    expect(resolvers.completed).toBe(true);
    await expect(executed).resolves.toBeUndefined();
  });
  test.concurrent("for of", async ({ expect }) => {
    const resolvers = withResolvers<number>();
    const { enqueue, stream } = resolvers;
    expect(resolvers.completed).toBe(false);
    const executed = (async () => {
      enqueue(4);
      await timeout(100);
      enqueue(5);
      await timeout(100);
      enqueue(6);
    })();
    expect(resolvers.completed).toBe(false);
    for await (const num of stream) {
      if (num >= 5) break;
      expect(num).toEqual(4);
    }
    expect(resolvers.completed).toBe(true);
    await expect(executed).rejects.toThrowError(TypeError);
  });
});

describe("stop call", () => {
  test.concurrent("enqueue", async ({ expect }) => {
    const resolvers = withResolvers<number>();
    const { enqueue, stream, close } = resolvers;
    expect(resolvers.completed).toBe(false);
    const executed = (async () => {
      enqueue(1);
      await timeout(100);
      close();
      await timeout(100);
      enqueue(2);
    })();

    expect(resolvers.completed).toBe(false);
    await expect(Array.fromAsync(stream)).resolves.toEqual([
      1,
    ]);

    expect(resolvers.completed).toBe(true);
    await expect(executed).rejects.toThrowError(TypeError);
  });
  test.concurrent("close", async ({ expect }) => {
    const resolvers = withResolvers<number>();
    const { stream, close } = resolvers;
    expect(resolvers.completed).toBe(false);
    const executed = (async () => {
      close();
      await timeout(100);
      close();
    })();
    expect(resolvers.completed).toBe(true);
    await expect(Array.fromAsync(stream)).resolves.toEqual([]);
    await expect(executed).rejects.toThrowError(TypeError);
  });
  test.concurrent("error", async ({ expect }) => {
    const resolvers = withResolvers<number>();
    const { enqueue, stream, close, error } = resolvers;
    const errorInstance = new Error("error");
    expect(resolvers.completed).toBe(false);
    const executed = (async () => {
      enqueue(4);
      close();
      error(errorInstance);
    })();

    expect(resolvers.completed).toBe(true);
    await expect(Array.fromAsync(stream)).rejects.toThrowError(errorInstance);
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
