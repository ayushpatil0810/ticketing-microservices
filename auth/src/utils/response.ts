import type { Response } from "express";

/**
 * Sends a standardised JSON response.
 *
 * Shape: { success, message, data }
 */
const apiResponse = (
  res: Response,
  success: boolean,
  message: string,
  data: unknown = null,
  statusCode = success ? 200 : 400,
): Response => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export { apiResponse };
