import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql } from "../client";

const deleteSharedSessionMutation = graphql(`
  mutation deleteSharedSession($user_id: String!, $session_id: uuid!) {
    delete_shared_sessions(
      where: { user_id: { _eq: $user_id }, session_id: { _eq: $session_id } }
    ) {
      returning {
        user_id
        session_id
      }
    }
  }
`);

export const deleteSharedSession = async ({
  session_id,
  user_id,
}: {
  session_id: string;
  user_id: string;
}) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.mutation(deleteSharedSessionMutation, {
      session_id,
      user_id,
    });

    if (error) processServerError(error);

    return data?.delete_shared_sessions;
  } catch (e) {
    processServerError(e);
  }
};
