import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, VariablesOf } from "../client";

const upsertSessionMutation = graphql(`
  mutation upsertSession($object: session_insert_input!) {
    insert_session_one(
      object: $object
      on_conflict: { constraint: session_pkey, update_columns: [name] }
    ) {
      id
    }
  }
`);

export const upsertSession = async (
  object: VariablesOf<typeof upsertSessionMutation>["object"]
) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.mutation(upsertSessionMutation, {
      object,
    });

    if (error) processServerError(error);

    return data?.insert_session_one?.id;
  } catch (e) {
    processServerError(e);
  }
};
