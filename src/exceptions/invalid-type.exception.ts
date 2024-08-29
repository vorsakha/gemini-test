import { BAD_REQUEST } from "http-status";
import HttpException from "@/exceptions/http.exception";

class InvalidTypeException extends HttpException {
  constructor(error_description: string) {
    super(error_description, "INVALID_TYPE", BAD_REQUEST);
  }
}

export default InvalidTypeException;
