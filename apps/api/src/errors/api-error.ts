export type ApiErrorCode =
  | 'invalid_json'
  | 'invalid_request'
  | 'invalid_project_id'
  | 'not_found'
  | 'project_not_found'
  | 'internal_error';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ApiErrorCode,
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(
    code: Extract<
      ApiErrorCode,
      'invalid_json' | 'invalid_request' | 'invalid_project_id'
    >,
    message: string,
    details: Record<string, unknown> = {},
  ) {
    super(400, code, message, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(
    code: Extract<ApiErrorCode, 'not_found' | 'project_not_found'>,
    message: string,
    details: Record<string, unknown> = {},
  ) {
    super(404, code, message, details);
    this.name = 'NotFoundError';
  }
}
