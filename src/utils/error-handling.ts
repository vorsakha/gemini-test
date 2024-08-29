import { Request, Response, NextFunction } from "express";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status";

import { HttpException } from "@/exceptions";

const prepareException = (
  error: HttpException | Error
): {
  error_code: string;
  error_description: string;
  status: number;
} => {
  let httpException: HttpException;

  if (!(error instanceof HttpException)) {
    httpException = new HttpException(
      "Something went wrong",
      "SERVER_ERROR",
      INTERNAL_SERVER_ERROR
    );
  } else {
    httpException = error;
  }

  const { error_code, error_description, status } = httpException;

  return { status, error_code, error_description };
};

const notFoundHandler = (_: Request, res: Response): Response => {
  return res.status(NOT_FOUND).json({ message: "Resource not found" });
};

const errorHandler = (
  error: HttpException | Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  __: NextFunction
): Response => {
  const { error_code, error_description, status } = prepareException(error);
  return res.status(status).json({ error_description, error_code });
};

export { prepareException, notFoundHandler, errorHandler };
