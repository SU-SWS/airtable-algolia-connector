import type { Config, Context } from '@netlify/functions';
import Airtable from 'airtable';
import * as dotenv from 'dotenv';

export type AirtableRecord = {
  id: string;
  [key: string]: any;
}

export type AirtableConfig = {
  maxRecords: number;
  view?: string;
}

export default async (event: Request, context: Context) => {
  dotenv.config();
  const {
    algoliaID, base, table,
  } = context.params;
  const [algoliaIDDecode, baseDecode, tableDecode] = [
    decodeURIComponent(algoliaID),
    decodeURIComponent(base),
    decodeURIComponent(table),
  ];
  const airtable = new Airtable({ apiKey: process.env[`${algoliaIDDecode}_PAC`] }).base(baseDecode);
  const airtableConfig:AirtableConfig = {
    maxRecords: 5000, // Current limit for Airtable API due to 10s function timeout and 500/req/second limit.
  };
  const data:AirtableRecord[] = [];

  // Optional view parameter.
  if (context.params.view) {
    airtableConfig.view = decodeURIComponent(context.params.view);
  }

  try {
    await airtable(tableDecode).select(airtableConfig).eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        const keys = Object.keys(record.fields);
        const vals = Object.values(record.fields);
        const saniKeys = keys.map((key) => key.replace(/\s|-/g, '_').toLowerCase());
        const saniObject = Object.fromEntries(saniKeys.map((_, i) => [saniKeys[i], vals[i]]));
        delete saniObject.last_modified_by; // The item contains ids, emails, and names.
        delete saniObject.objectID; // Duplicate of id.
        delete saniObject.record_id; // Duplicate of id.
        const rec = {
          id: record.getId(),
          ...saniObject,
        };
        data.push(rec);
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
    });

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
};

export const config: Config = {
  path: [
    '/api/proxy/:algoliaID/:base/:table',
    '/api/proxy/:algoliaID/:base/:table/:view',
  ],
};
