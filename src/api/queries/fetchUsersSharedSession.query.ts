import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql } from "../client";

const fetchUsersSharedSessionQuery = graphql(`
  query fetchUsers($session_id: uuid, $user_id: String) {
    users(where: { id: { _neq: $user_id } }) {
      id
      username
    }
    shared_sessions(where: { session_id: { _eq: $session_id } }) {
      user_id
    }
  }
`);

export const fetchUsersSharedSession = async (
  session_id: string,
  user_id?: string
) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.query(fetchUsersSharedSessionQuery, {
      session_id,
      user_id,
    });

    if (error) processServerError(error);

    return data;
  } catch (e) {
    processServerError(e);
    return;
  }
};
