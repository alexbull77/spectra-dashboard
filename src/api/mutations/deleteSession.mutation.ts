import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql } from "../client";

const deleteSessionMutation = graphql(`
  mutation deleteSession($id: uuid!) {
    delete_session_by_pk(id: $id) {
      id
    }
  }
`);

export const deleteSession = async (id: string) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.mutation(deleteSessionMutation, {
      id,
    });

    if (error) processServerError(error);

    return data?.delete_session_by_pk?.id;
  } catch (e) {
    processServerError(e);
  }
};
