import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql } from "../client";

const deleteMicrofrontendMutation = graphql(`
  mutation deleteMicrofrontend($id: uuid!) {
    delete_microfrontends_by_pk(id: $id) {
      id
    }
  }
`);

export const deleteMicrofrontend = async (id: string) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.mutation(deleteMicrofrontendMutation, {
      id,
    });

    if (error) processServerError(error);

    return data?.delete_microfrontends_by_pk?.id;
  } catch (e) {
    processServerError(e);
  }
};
