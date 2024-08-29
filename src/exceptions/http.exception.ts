import { BAD_REQUEST } from "http-status";

export default class HttpException extends Error {
  status: number = BAD_REQUEST;

  error_code: string;

  error_description: string;

  constructor(error_description: string, error_code: string, status: number) {
    super(error_description);
    Object.setPrototypeOf(this, HttpException.prototype);

    this.error_code = error_code;
    this.error_description = error_description;
    this.status = status;

    Error.captureStackTrace(this);
  }
}
