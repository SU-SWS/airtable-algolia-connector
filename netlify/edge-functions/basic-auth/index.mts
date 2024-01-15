import type { Config, Context } from "@netlify/edge-functions";


export default async (request: Request, context: Context) => {

  const { headers } = request;
  const authheads = headers.get('authorization');

  // Validate basic auth credentials.
  if (authheads) {
    const [type, credentials] = authheads.split(" ");
    // TODO: Get credentials from environment variables.
    if (type === "Basic" && credentials === "dGVzdDp0ZXN0") {
      // valid. Just pass through.
      return;
    }
  }

  // Not valid credentials or no credentials provided.
  const response = new Response("Unauthorized", {
    headers: { "WWW-Authenticate": "Basic realm=\"Airtable / Algolia Connector\"" },
    status: 401,
  });

  return response;
};

export const config: Config = {
  path: "/api/*",
  onError: "/edge-crash"
}
