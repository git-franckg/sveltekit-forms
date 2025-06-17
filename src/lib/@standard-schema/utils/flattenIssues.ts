// Partially copied from https://github.com/EskiMojo14/standard-schema

import type { StandardSchemaV1 } from '@standard-schema/spec';

export type KeyofUnion<T> = T extends unknown ? keyof T : never;

/**
 * Get the key of a path segment.
 *
 * @param pathSegment The path segment to get the key from.
 *
 * @returns The key of the path segment.
 */
export function getPathSegmentKey(pathSegment: StandardSchemaV1.PathSegment | PropertyKey): PropertyKey {
  return typeof pathSegment === 'object' ? pathSegment.key : pathSegment;
}

export type InferFlattenedIssues<Output> = FlattenedIssues<Output>;

export interface FlattenedIssues<Fields> {
  formIssues: readonly string[];
  fieldIssues: Partial<Record<KeyofUnion<Fields>, readonly string[]>>;
}

export type IssueMapper<MappedIssue> = (issue: StandardSchemaV1.Issue) => MappedIssue;

/**
 * Flatten issues into form and field errors. Useful for schemas that are one level deep.
 *
 * @param schema The schema the issues came from (for inferring the shape of the field errors).
 *
 * @param issues The issues to flatten.
 */
export function flattenIssues<Schema extends StandardSchemaV1>(
  schema: Schema,
  issues: readonly StandardSchemaV1.Issue[]
): InferFlattenedIssues<StandardSchemaV1.InferOutput<Schema>>;

export function flattenIssues(_schema: StandardSchemaV1, issues: readonly StandardSchemaV1.Issue[]): FlattenedIssues<unknown> {
  const formIssues: string[] = [];
  const fieldIssues: Record<PropertyKey, string[]> = {};

  for (const issue of issues) {
    if (issue.path?.length) {
      const key = getPathSegmentKey(issue.path[0]);
      fieldIssues[key] ??= [];
      fieldIssues[key].push(issue.message);
    } else {
      formIssues.push(issue.message);
    }
  }

  return {
    formIssues,
    fieldIssues
  };
}
