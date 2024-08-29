import dotenv from "dotenv";
import { Environment, Config } from "@/modules/support/sanitized-config/types";

const getEnvironment = (): Environment => {
  return {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  };
};

const getSanitzedConfig = (config: Environment): Config => {
  (Object.keys(config) as (keyof typeof config)[]).forEach((key) => {
    const value = config[key];
    if (value === undefined) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  return config as Config;
};

dotenv.config();

const config = getEnvironment();
const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
