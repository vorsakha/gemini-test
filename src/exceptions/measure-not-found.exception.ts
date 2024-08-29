import { NOT_FOUND } from "http-status";
import HttpException from "@/exceptions/http.exception";

class MeasureNotFoundException extends HttpException {
  constructor(error_description: string) {
    super(error_description, "MEASURE_NOT_FOUND", NOT_FOUND);
  }
}

export default MeasureNotFoundException;
