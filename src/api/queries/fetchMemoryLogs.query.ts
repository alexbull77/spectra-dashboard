import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql } from "../client";

const fetchMemoryLogsQuery = graphql(`
  query fetchMemoryLogs($sessionId: uuid!) {
    memory_logs(
      where: { _and: [{ session_id: { _eq: $sessionId } }] }
      order_by: { recorded_at: asc }
    ) {
      id
      heap_limit
      js_heap_limit_mb
      js_heap_total_mb
      recorded_at
    }
  }
`);

export const fetchMemoryLogs = async ({ sessionId }: { sessionId: string }) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.query(fetchMemoryLogsQuery, {
      sessionId,
    });

    if (error) processServerError(error);

    return data?.memory_logs || [];
  } catch (e) {
    processServerError(e);
    return [];
  }
};
