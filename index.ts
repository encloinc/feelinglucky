import dotenv from "dotenv";
dotenv.config();

import { runIndexer } from "./src/indexer";
import { createRpcProxy } from "./src/rpcproxy";
import { createApiServer } from "./src/api";
import { createInternalApiServer } from "./src/internalapi";
import { databaseConnection } from "./src/database";
import { checkEnvForFields } from "./src/utils";
import { log } from "./src/utils";

const requiredEnvFields = [
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "RPC_BASE_URL",
  "RPC_USERNAME",
  "RPC_PASSWORD",
  "API_PORT",
  "USE_RATE_LIMIT"
];

const start = async () => {
  if (!checkEnvForFields(requiredEnvFields, "main")) {
    return;
  }

  const models = await databaseConnection(process.argv.includes("-new"));
  log("Database connection established", "Database");

  if (process.argv.includes("-indexer")) {
    runIndexer(models);
  }

  if (process.argv.includes("-rpcproxy")) {
    createRpcProxy(models);
  }

  if (process.argv.includes("-internalapi")) {
    createInternalApiServer(models);
  }

  if (process.argv.includes("-api")) {
    createApiServer(models);
  }
};

start();
