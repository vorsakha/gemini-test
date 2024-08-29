import { NOT_FOUND } from "http-status";
import HttpException from "@/exceptions/http.exception";

class MeasuresNotFoundException extends HttpException {
  constructor(error_description: string) {
    super(error_description, "MEASURES_NOT_FOUND", NOT_FOUND);
  }
}

export default MeasuresNotFoundException;
