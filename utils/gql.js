import { parseCookies } from "nookies";
import { GraphQLClient } from "graphql-request";

export const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/graphql`;
export const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${parseCookies().jwt}`,
  },
});
