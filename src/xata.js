// xata.js
import { buildClient } from "@xata.io/client";
import dotenv from "dotenv";
dotenv.config(); // Load env variables from .env or process.env

/** @typedef { import('./types').SchemaTables } SchemaTables */
const tables = [/* your tables array stays the same */];

/** @type { import('@xata.io/client').ClientConstructor<{}> } */
const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL: process.env.XATA_DATABASE_URL,
  apiKey: process.env.XATA_API_KEY,
  branch: "main"
};

/** @typedef { import('./types').DatabaseSchema } DatabaseSchema */
/** @extends DatabaseClient<DatabaseSchema> */
export class XataClient extends DatabaseClient {
  constructor(options = {}) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance = undefined;

/** @type { () => XataClient } */
export const getXataClient = () => {
  if (instance) return instance;
  instance = new XataClient();
  return instance;
};
