import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, ResultOf } from "../client";

const fetchSessionsQuery = graphql(`
  query fetchSessions($user_id: String) {
    session(
      where: { user_id: { _eq: $user_id } }
      order_by: { created_at: desc }
    ) {
      id
      name
      created_at
    }
  }
`);

export type ISession = ResultOf<typeof fetchSessionsQuery>["session"][0];

export const fetchSessions = async ({ user_id }: { user_id?: string }) => {
  try {
    if (!user_id) return [];
    const client = await getSpectraClient();

    const { data, error } = await client.query(fetchSessionsQuery, { user_id });

    if (error) processServerError(error);

    return data?.session || [];
  } catch (e) {
    processServerError(e);
    return [];
  }
};
