import { CONFLICT } from "http-status";
import HttpException from "@/exceptions/http.exception";

class ConfirmationDuplicateException extends HttpException {
  constructor(error_description: string) {
    super(error_description, "CONFIRMATION_DUPLICATE", CONFLICT);
  }
}

export default ConfirmationDuplicateException;
