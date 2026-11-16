/**
 * Helper type to ensure TypeScript correctly infers `ReadableStream<T>`
 * including `AsyncIterable<T>` support without requiring `@types/node`.
 */
export type ReadableStream<T> = globalThis.ReadableStream<T> & AsyncIterable<T>;
