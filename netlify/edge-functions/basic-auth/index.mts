import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const response = await context.next();
  response.headers.set("Authorization", "Basic dGVzdDp0ZXN0");
  return response;
};

export const config: Config = {
  path: "/api/*",
  onError: "/edge-crash"
}
