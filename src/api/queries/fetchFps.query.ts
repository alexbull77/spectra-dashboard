import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql } from "../client";

const fetchFpsQuery = graphql(`
  query fetchFps($sessionId: uuid!) {
    fps_logs(
      where: { _and: [{ session_id: { _eq: $sessionId } }] }
      order_by: { recorded_at: asc }
    ) {
      id
      fps
      recorded_at
    }
  }
`);

export const fetchFps = async ({ sessionId }: { sessionId: string }) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.query(fetchFpsQuery, {
      sessionId,
    });

    if (error) processServerError(error);

    return data?.fps_logs || [];
  } catch (e) {
    processServerError(e);
    return [];
  }
};
