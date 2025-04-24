import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, ResultOf } from "../client";
import { Dispatch, SetStateAction } from "react";

const memoryLogsSubscription = graphql(`
  subscription memoryLogsSubscription($sessionId: uuid!) {
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

export type IMemoryLog = ResultOf<
  typeof memoryLogsSubscription
>["memory_logs"][0];

export const subscribeToMemoryLogs = async ({
  sessionId,
  setData,
}: {
  sessionId: string;
  setData: Dispatch<SetStateAction<IMemoryLog[]>>;
}) => {
  const client = await getSpectraClient();

  const { unsubscribe } = client
    .subscription(memoryLogsSubscription, {
      sessionId,
    })
    .subscribe(({ data, error }) => {
      if (error) processServerError(error);

      setData(data?.memory_logs || []);
    });

  return unsubscribe;
};
