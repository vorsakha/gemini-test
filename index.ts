import dotenv from "dotenv";
import "reflect-metadata";

import server from "@/server";

const init = async () => {
  dotenv.config();

  server.serve();
};

init().then(() => {
  // eslint-disable-next-line no-console
  console.info("Application started");
});
