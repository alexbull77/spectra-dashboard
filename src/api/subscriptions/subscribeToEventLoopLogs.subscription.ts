import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, ResultOf } from "../client";
import { Dispatch, SetStateAction } from "react";

const eventLoopLogs = graphql(`
  subscription eventLoopLogs($sessionId: uuid!) {
    event_loop_logs(
      where: { _and: [{ session_id: { _eq: $sessionId } }] }
      order_by: { recorded_at: asc }
    ) {
      id
      type
      duration_ms
      recorded_at
    }
  }
`);

export type IEventLoopLog = ResultOf<
  typeof eventLoopLogs
>["event_loop_logs"][0];

export const subscribeToEventLoopLogs = async ({
  sessionId,
  setData,
}: {
  sessionId: string;
  setData: Dispatch<SetStateAction<IEventLoopLog[]>>;
}) => {
  const client = await getSpectraClient();

  const { unsubscribe } = client
    .subscription(eventLoopLogs, {
      sessionId,
    })
    .subscribe(({ data, error }) => {
      if (error) processServerError(error);

      setData(data?.event_loop_logs || []);
    });

  return unsubscribe;
};
