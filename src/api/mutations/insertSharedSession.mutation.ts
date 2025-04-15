import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, VariablesOf } from "../client";

const insertSharedSessionMutation = graphql(`
  mutation insertSharedSession($object: shared_sessions_insert_input!) {
    insert_shared_sessions_one(object: $object) {
      user_id
      session_id
    }
  }
`);

export const insertSharedSession = async (
  object: VariablesOf<typeof insertSharedSessionMutation>["object"]
) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.mutation(insertSharedSessionMutation, {
      object,
    });

    if (error) processServerError(error);

    return data?.insert_shared_sessions_one;
  } catch (e) {
    processServerError(e);
  }
};
