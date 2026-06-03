import type { Response } from "express";

// Utility functions for sending standardized API responses
// const sendSuccess = (
//   res: Response,
//   data: unknown = null,
//   message = "Success",
//   statusCode = 200,
// ) => {
//   return res.status(statusCode).json({
//     success: true,
//     message,
//     data,
//   });
// };

// export { sendSuccess };

const apiResponse = (
  res: Response,
  success: boolean,
  message: string,
  data: unknown = null,
  statusCode = success ? 200 : 400,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export { apiResponse };
