import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/zod.middleware";
import { Router } from "express";
import StorageService from "@/modules/storage/application/storage.service";
import fileValidation from "@/modules/reading/validations/file.validation";
import ReadingController from "@/modules/reading/controllers/reading.controller";
import ReadingService from "@/modules/reading/application/reading.service";
import DefaultReadingRepository from "@/modules/reading/infrastructure/repositories/default-reading.repository";
import GeminiService from "@/modules/reading/application/gemini.service";
import {
  confirmSchema,
  findByCustomerCodeSchema,
  querySchema,
} from "@/modules/reading/validations/reading.validation";

const getReadingRoutes = () => {
  const readingService = new ReadingService(
    new DefaultReadingRepository(),
    new GeminiService(),
    new StorageService()
  );

  const readingController = new ReadingController(readingService);

  const router = Router();

  router.post(
    "/upload",
    validateBody(fileValidation),
    readingController.create.bind(readingController)
  );

  router.patch(
    "/confirm",
    validateBody(confirmSchema),
    readingController.confirm.bind(readingController)
  );

  router.get(
    "/:customer_code/list",
    validateParams(findByCustomerCodeSchema),
    validateQuery(querySchema),
    readingController.index.bind(readingController)
  );

  return router;
};

export default getReadingRoutes;
