import type { Handler } from "@netlify/functions"

const API_ENDPOINT = "https://jsonplaceholder.typicode.com";
const API_PATH = "/todos";

export const handler: Handler = async (event, context) => {

  const response = await fetch(`${API_ENDPOINT}${API_PATH}`);
  const data = await response.json();

  return {
    body: JSON.stringify(data),
    statusCode: 200,
  }
}
