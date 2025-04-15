import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, VariablesOf } from "../client";

const upsertUserMutation = graphql(`
  mutation upsertUser($object: users_insert_input!) {
    insert_users_one(
      object: $object
      on_conflict: { constraint: users_pkey, update_columns: [username] }
    ) {
      id
    }
  }
`);

export const upsertUser = async (
  object: VariablesOf<typeof upsertUserMutation>["object"]
) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.mutation(upsertUserMutation, {
      object,
    });

    if (error) processServerError(error);

    return data?.insert_users_one?.id;
  } catch (e) {
    processServerError(e);
  }
};
