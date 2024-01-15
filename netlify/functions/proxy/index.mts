import type { Handler } from "@netlify/functions"
import Airtable, { Record } from "airtable";
const dotenv = require('dotenv');
dotenv.config();

export type AirtableRecord = {
  id: string;
  [key: string]: any;
}

export const handler: Handler = async (event, context) => {

  const airtable = new Airtable({ apiKey: process.env.AIRTABLE_TEST_KEY });
  const base = airtable.base(process.env.AIRTABLE_TEST_BASE!);
  let data:AirtableRecord[] = [];

  // TODO: Pull values from the request params.
  await base('Items').select({
    view: "Gallery of pre-approved items"
  }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function(record) {
        const rec = {
          id: record.getId(),
          ...record.fields
        };
        data.push(rec);
      });

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
  });

  return {
    body: JSON.stringify(data),
    statusCode: 200,
  }
}
