/**
 * Helper type to ensure TypeScript correctly infers `ReadableStream<T>`.
 * Required for `withSafeResolvers<T>()` to return a properly typed stream.
 */
export type ReadableStream<T> = import("stream/web").ReadableStream<T>;
