import { buildClient } from "@xata.io/client";
import dotenv from "dotenv";
dotenv.config({path: '/workspaces/CapstoneProject/src/process.env'}); // Load environment variables from .env

// Define the default options for the Xata client
const defaultOptions = {
  databaseURL: process.env.XATA_DATABASE_URL, // Ensure this is set in your .env file
  apiKey: process.env.XATA_API_KEY,  // Ensure this is set in your .env file
  branch: "main"  // Set to the correct branch (e.g., "main")
};

/** @typedef { import('./types').SchemaTables } SchemaTables */
const tables = [/* your tables array stays the same */];

// Initialize the DatabaseClient with defaultOptions
const DatabaseClient = buildClient(defaultOptions);

/** @typedef { import('./types').DatabaseSchema } DatabaseSchema */
/** @extends DatabaseClient<DatabaseSchema> */
export class XataClient extends DatabaseClient {
  constructor(options = {}) {
    super({ ...defaultOptions, ...options }, tables);  // Ensure options are spread correctly
  }
}

let instance = undefined;

/** @type { () => XataClient } */
export const getXataClient = () => {
  if (instance) return instance;
  instance = new XataClient();
  return instance;
};
