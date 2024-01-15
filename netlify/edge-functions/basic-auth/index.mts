import type { Config, Context } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
  const { headers } = request;
  const authheads = headers.get('authorization');

  // Validate basic auth credentials.
  if (authheads) {
    const [type, credentials] = authheads.split(' ');
    const { algoliaID } = context.params;
    const username = Netlify.env.get(`${algoliaID}_USR`);
    const password = Netlify.env.get(`${algoliaID}_PWD`);

    // base64 encode the username and password
    const encoded = btoa(`${username}:${password}`);

    // Compare the encoded credentials to the provided credentials.
    if (type === 'Basic' && credentials === encoded) {
      // valid. Just pass through.
      return;
    }
  }

  // Not valid credentials or no credentials provided.
  const response = new Response('Unauthorized', {
    headers: { 'WWW-Authenticate': 'Basic realm="Airtable / Algolia Connector"' },
    status: 401,
  });

  // eslint-disable-next-line consistent-return
  return response;
};

export const config: Config = {
  path: '/api/proxy/:algoliaID/*',
  onError: '/edge-crash',
};
