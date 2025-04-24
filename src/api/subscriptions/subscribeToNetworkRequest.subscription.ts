import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, ResultOf } from "../client";

const networkRequestSubscription = graphql(`
  subscription fetchNetworkRequests(
    $sessionId: uuid!
    $microfrontendId: uuid!
  ) {
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
  typeof networkRequestSubscription
>["network_requests"][0];

export const subscribeToNetworkRequests = async ({
  sessionId,
  microfrontendId,
  setData,
}: {
  sessionId: string;
  microfrontendId: string;
  setData: (data: INetworkRequest[]) => void;
}) => {
  const client = await getSpectraClient();

  const { unsubscribe } = await client
    .subscription(networkRequestSubscription, {
      sessionId,
      microfrontendId,
    })
    .subscribe(({ data, error }) => {
      if (error) processServerError(error);

      setData(data?.network_requests || []);
    });

  return unsubscribe;
};
