import { buildClient } from '@xata.io/client';
import dotenv from 'dotenv';
import path from 'path';

// Load .env variables from ../api/.env
dotenv.config({ path: path.resolve('./api/process.env') });

// Retrieve Xata API Key and Database URL from environment variables
const { XATA_API_KEY, XATA_DATABASE_URL } = process.env;

// Validate that required environment variables are available
if (!XATA_API_KEY || !XATA_DATABASE_URL) {
  throw new Error('Xata database URL or API key is missing in environment variables.');
}

// Exported function to create a Xata client
export const getXataClient = ({ apiKey = XATA_API_KEY, databaseURL = XATA_DATABASE_URL, branch = 'main' }) =>
  buildClient({
    apiKey,
    databaseURL,
    branch
  });