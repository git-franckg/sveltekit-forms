/**
 * Error type returned when duplicate values are found in an array.
 * Using a string literal type ensures it cannot be confused with a valid array.
 */
type DuplicateError<T> = `Error: Duplicate value '${T & string}'`;

/**
 * Utility type that recursively checks if an array contains only unique values.
 *
 * @template T - The array to check for uniqueness
 * @template A - Accumulator array tracking already seen values (internal use)
 *
 * @returns The original array type if all values are unique,
 *          or DuplicateError<value> if duplicates found
 *
 * @example
 * type Valid = UniqueArray<['a', 'b', 'c']>; // ['a', 'b', 'c']
 * type Invalid = UniqueArray<['a', 'b', 'a']>; // "Error: Duplicate value 'a'"
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
type UniqueArray<T, A extends ReadonlyArray<any> = []> = T extends readonly [infer Head, ...infer Tail]
  ? Head extends A[number]
    ? DuplicateError<Head>
    : UniqueArray<Tail, [...A, Head]>
  : T;

/**
 * Helper type that ensures an array contains only unique values.
 * Provides compile-time validation with clear error messages.
 *
 * @template T - The array type to validate
 *
 * @returns The array type if valid, or never if duplicates exist
 *
 * @example
 * type Flow = EnsureUniqueArray<['step1', 'step2']>; // ['step1', 'step2']
 * type BadFlow = EnsureUniqueArray<['step1', 'step1']>; // never (with type error showing the duplicate)
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type EnsureUniqueArray<T extends ReadonlyArray<any>> = UniqueArray<T> extends ReadonlyArray<any> ? UniqueArray<T> : never;

/**
 * `keyof` mais qui fonctionne sur les union.
 *
 * # Example
 *
 * ```typescript
 * type T = { type: 'a', fieldA: boolean } | { type: 'b', fieldB: boolean }
 *
 * // SimpleKeyof = 'type'
 * type Normal = keyof T
 *
 * // Result = 'type' | 'fieldA' | 'fieldB'
 * type Result = KeyofUnion<T>
 * ```
 */
export type KeyofUnion<T> = T extends unknown ? keyof T : never;

/**
 * Returns an array of the object's keys with proper type inference.
 *
 * Unlike Object.keys() which returns string[], this function preserves
 * the literal types of the object's keys, providing better type safety
 * when iterating over objects with known key types.
 *
 * @template T - The type of the object being processed
 * @param {T} obj - The object whose keys will be extracted
 * @returns {Array<keyof T>} An array of the object's keys with preserved literal types
 *
 * @example
 * // With a Record type
 * const record: Record<'a' | 'b', string> = { a: 'hello', b: 'world' };
 * const keys = typedKeys(record); // Array<'a' | 'b'>
 *
 * @example
 * // With a regular object
 * const obj = { foo: 1, bar: 2 } as const;
 * const keys = typedKeys(obj); // Array<'foo' | 'bar'>
 *
 * @example
 * // Using in iteration
 * typedKeys(record).forEach(key => {
 *   const value = record[key]; // key is properly typed as 'a' | 'b'
 * });
 */
export function typedKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
