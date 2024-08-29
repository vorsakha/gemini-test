import { Request, Response } from "express";
import { OK } from "http-status";
import ReadingService from "@/modules/reading/application/reading.service";
import ReadingPresenter from "@/modules/reading/resources/presenters/reading-presenter";
import {
  ConfirmSchema,
  QuerySchema,
} from "@/modules/reading/validations/reading.validation";
import ReadingListPresenter from "@/modules/reading/resources/presenters/reading-list.presenter";

class ReadingController {
  protected readingService: ReadingService;

  constructor(readingService: ReadingService) {
    this.readingService = readingService;
  }

  async create(req: Request, res: Response) {
    const reading = req.body;

    const newReading = await this.readingService.create(reading);

    res.status(OK).json(new ReadingPresenter(newReading));
  }

  async confirm(req: Request, res: Response) {
    const { measure_uuid, confirmed_value }: ConfirmSchema = req.body;

    await this.readingService.confirm(measure_uuid, confirmed_value);

    res.status(OK).json({ success: true });
  }

  async index(req: Request, res: Response) {
    const { customer_code } = req.params;
    const { measure_type }: QuerySchema = req.query;

    const readings = await this.readingService.findByCustomerCode(
      customer_code,
      measure_type
    );

    res.status(OK).json(new ReadingListPresenter(customer_code, readings));
  }
}

export default ReadingController;
