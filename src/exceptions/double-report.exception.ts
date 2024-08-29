import { CONFLICT } from "http-status";
import HttpException from "@/exceptions/http.exception";

class DoubleReportException extends HttpException {
  constructor(error_description: string) {
    super(error_description, "DOUBLE_REPORT", CONFLICT);
  }
}

export default DoubleReportException;
