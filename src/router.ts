import { Router } from "express";
import getReadingRoutes from "@/modules/reading/routes/reading.routes";

export const getRoutes = () => {
  const router = Router();

  router.use("/", getReadingRoutes());

  return router;
};
