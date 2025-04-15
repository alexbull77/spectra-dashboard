import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql } from "../client";

const fetchMicrofrontendsQuery = graphql(`
  query fetchMicrofrontends($sessionId: uuid!) {
    microfrontends(
      where: { session_id: { _eq: $sessionId } }
      order_by: { loaded_at: asc }
    ) {
      id
      name
      version
    }
  }
`);

export const fetchMicrofrontends = async ({
  sessionId,
}: {
  sessionId?: string;
}) => {
  try {
    if (!sessionId) return [];
    const client = await getSpectraClient();

    const { data, error } = await client.query(fetchMicrofrontendsQuery, {
      sessionId,
    });

    if (error) processServerError(error);

    return data?.microfrontends || [];
  } catch (e) {
    processServerError(e);
    return [];
  }
};
