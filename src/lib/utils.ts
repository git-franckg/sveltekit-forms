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
