/**
 * Base operational error class.
 *
 * All custom errors extend this so the error handler can distinguish between
 * errors we threw intentionally vs. unexpected crashes.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 – Thrown when the caller sends malformed / invalid data.
 * Optionally carries structured validation details (e.g. Zod flatten tree).
 */
export class RequestError extends AppError {
  readonly details: unknown;

  constructor(message: string, details: unknown = null, statusCode = 400) {
    super(message, statusCode);
    this.details = details;
  }
}

/**
 * 401 – Thrown when a request lacks valid credentials.
 */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/**
 * 403 – Thrown when a caller is authenticated but not permitted.
 */
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

/**
 * 404 – Thrown when a requested resource does not exist.
 */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * 409 – Thrown when a resource conflict occurs (e.g. duplicate email).
 */
export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}
