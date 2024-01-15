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
    algoliaID, base, table, view,
  } = context.params;
  const [algoliaIDDecode, baseDecode, tableDecode, viewDecode] = [
    decodeURIComponent(algoliaID),
    decodeURIComponent(base),
    decodeURIComponent(table),
    decodeURIComponent(view),
  ];
  const airtable = new Airtable({ apiKey: process.env[`${algoliaIDDecode}_PAC`] }).base(baseDecode);
  const data:AirtableRecord[] = [];

  try {
    await airtable(tableDecode).select({
      view: viewDecode,
    }).eachPage((records, fetchNextPage) => {
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
  path: '/api/proxy/:algoliaID/:base/:table/:view',
};
