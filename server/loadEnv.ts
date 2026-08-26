import dotenv from "dotenv";
import path from "path";

const DEFAULT_ENV_PATH = path.join(__dirname, ".env");

const isEmptyEnvValue = (value: string | undefined): boolean => {
  return value == null || value.trim() === "";
};

// dotenv does not override existing keys. PM2 can export INSIGHTS_SECRET=""
// which would otherwise block the value in server/.env.
export const loadServerEnv = (envPath: string = DEFAULT_ENV_PATH) => {
  if (isEmptyEnvValue(process.env.INSIGHTS_SECRET)) {
    delete process.env.INSIGHTS_SECRET;
  }

  const result = dotenv.config({ path: envPath });
  const parsed = result.parsed;

  if (parsed) {
    Object.keys(parsed).forEach(key => {
      if (isEmptyEnvValue(process.env[key])) {
        process.env[key] = parsed[key];
      }
    });
  }

  return result;
};

loadServerEnv();
