import express from "express";
import "express-async-errors";
import cors from "cors";

import { errorHandler, notFoundHandler } from "@/utils/error-handling";
import { getRoutes } from "@/router";

const init = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(getRoutes());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

const serve = () => {
  const app = init();
  app.listen(80, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port 80`);
  });
};

export default { init, serve };
