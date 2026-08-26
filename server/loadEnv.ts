import fs from "fs";
import path from "path";

const DEFAULT_ENV_PATH = path.join(__dirname, ".env");

const isEmptyEnvValue = (value: string | undefined): boolean => {
  return value == null || value.trim() === "";
};

export const parseEnvFile = (contents: string): { [key: string]: string } => {
  const parsed: { [key: string]: string } = {};
  contents.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.charAt(0) === "#") {
      return;
    }

    const withoutExport =
      trimmed.indexOf("export ") === 0 ? trimmed.slice(7).trim() : trimmed;
    const eq = withoutExport.indexOf("=");
    if (eq <= 0) {
      return;
    }

    const key = withoutExport.slice(0, eq).trim();
    let value = withoutExport.slice(eq + 1).trim();
    const quote = value.charAt(0);
    if (
      (quote === '"' || quote === "'") &&
      value.length >= 2 &&
      value.charAt(value.length - 1) === quote
    ) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  });
  return parsed;
};

const applyParsedEnv = (parsed: { [key: string]: string }) => {
  Object.keys(parsed).forEach(key => {
    if (isEmptyEnvValue(process.env[key])) {
      process.env[key] = parsed[key];
    }
  });
};

// Load server/.env even when the dotenv package is missing (git pull without
// yarn install) and even when PM2 already exported INSIGHTS_SECRET="".
export const loadServerEnv = (envPath: string = DEFAULT_ENV_PATH) => {
  if (isEmptyEnvValue(process.env.INSIGHTS_SECRET)) {
    delete process.env.INSIGHTS_SECRET;
  }

  let parsed: { [key: string]: string } = {};

  try {
    // Optional: use dotenv when it is installed. require() avoids a boot crash
    // from default-import interop and from a missing node_modules/dotenv.
    // tslint:disable-next-line:no-var-requires
    const dotenv = require("dotenv");
    if (dotenv && typeof dotenv.config === "function") {
      const result = dotenv.config({ path: envPath });
      if (result && result.parsed) {
        parsed = result.parsed;
      }
    }
  } catch {
    console.log("dotenv package not used; reading .env directly");
  }

  try {
    if (fs.existsSync(envPath)) {
      const fromFile = parseEnvFile(fs.readFileSync(envPath, "utf8"));
      parsed = Object.assign({}, fromFile, parsed);
    }
  } catch (err) {
    const message = err && (err as Error).message;
    console.log("Could not read .env file", message || "unknown error");
  }

  applyParsedEnv(parsed);
  console.log("Loaded server env", {
    envFileExists: fs.existsSync(envPath),
    insightsSecretLoaded: !isEmptyEnvValue(process.env.INSIGHTS_SECRET)
  });
  return parsed;
};

try {
  loadServerEnv();
} catch (err) {
  const message = err && (err as Error).message;
  console.log("Failed to load server env", message || "unknown error");
}
