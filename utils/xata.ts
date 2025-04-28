import { XataClient } from 'utils/xata.ts'
export const xata = new XataClient({ apiKey: process.env.XATA_API_KEY })
