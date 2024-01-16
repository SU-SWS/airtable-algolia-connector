import type { Config, Context } from '@netlify/functions';
import Airtable from 'airtable';
import * as dotenv from 'dotenv';

export type AirtableRecord = {
  id: string;
  [key: string]: any;
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
  const airtableConfig = {};
  const data:AirtableRecord[] = [];

  // Optional view parameter.
  if (context.params.view) {
    airtableConfig['view'] = decodeURIComponent(context.params.view);
  }

  try {
    await airtable(tableDecode).select(airtableConfig).eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        const keys = Object.keys(record.fields);
        const vals = Object.values(record.fields);
        const saniKeys = keys.map((key) => key.replace(/\s|-/g, '_').toLowerCase());
        const saniObject = Object.fromEntries(saniKeys.map((_, i) => [saniKeys[i], vals[i]]));
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
    '/api/proxy/:algoliaID/:base/:table/:view',
    '/api/proxy/:algoliaID/:base/:table'
  ],
};
