import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, ResultOf } from "../client";

const fetchNetworkRequestsQuery = graphql(`
  query fetchNetworkRequests($sessionId: uuid!, $microfrontendId: uuid!) {
    network_requests(
      where: {
        _and: [
          { session_id: { _eq: $sessionId } }
          { microfrontend_id: { _eq: $microfrontendId } }
        ]
      }
      order_by: { created_at: desc }
    ) {
      id
      url
      method
      status
      response_size_bytes
      time_taken_ms
      response_body
      created_at
      payload
      headers
    }
  }
`);

export type INetworkRequest = ResultOf<
  typeof fetchNetworkRequestsQuery
>["network_requests"][0];

export const fetchNetworkRequests = async ({
  sessionId,
  microfrontendId,
}: {
  sessionId: string;
  microfrontendId: string;
}): Promise<INetworkRequest[]> => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.query(fetchNetworkRequestsQuery, {
      sessionId,
      microfrontendId,
    });

    if (error) processServerError(error);

    return data?.network_requests || [];
  } catch (e) {
    processServerError(e);
    return [];
  }
};
