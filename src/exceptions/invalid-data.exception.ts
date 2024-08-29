import HttpException from "@/exceptions/http.exception";
import { BAD_REQUEST } from "http-status";

class InvalidDataException extends HttpException {
  constructor(error_description: string) {
    super(error_description, "INVALID_DATA", BAD_REQUEST);
  }
}

export default InvalidDataException;
