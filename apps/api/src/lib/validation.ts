import { formatSchemaIssues } from '@portfolio-tq/schemas';
import type { JsonObject } from '@portfolio-tq/types';

import { ValidationError } from '../errors/api-error.js';

type SchemaValidationResult<TOutput> =
  | { success: true; data: TOutput }
  | {
      success: false;
      error: {
        issues: ReadonlyArray<{
          path: ReadonlyArray<PropertyKey>;
          message: string;
        }>;
      };
    };

export function assertValid<TOutput>(
  result: SchemaValidationResult<TOutput>,
  config: {
    code: 'invalid_request' | 'invalid_project_id';
    message: string;
    details?: JsonObject;
  },
): TOutput {
  if (result.success) {
    return result.data;
  }

  throw new ValidationError(config.code, config.message, {
    ...(config.details ?? {}),
    issues: formatSchemaIssues(result.error.issues),
  });
}
