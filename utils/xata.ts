import { XataClient } from '@xata.io/client';

export const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY
});

// Set the database URL separately if needed
xata.setDatabaseURL(process.env.DATABASE_URL!);

