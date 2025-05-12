import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, ResultOf } from "../client";
import { Dispatch, SetStateAction } from "react";

const localStorageLogs = graphql(`
  subscription localStorageLogs($sessionId: uuid!) {
    local_storage_metrics(
      where: { _and: [{ session_id: { _eq: $sessionId } }] }
      order_by: { recorded_at: desc }
    ) {
      id
      total_keys
      total_size_kb
      average_entry_size_kb
      largest_key
      largest_key_size_kb
      read_ops
      write_ops
      quota_used_percentage
      recorded_at
    }
  }
`);

export type ILocalStorageLog = ResultOf<
  typeof localStorageLogs
>["local_storage_metrics"][0];

export const subscribeToLocalStorageLogs = async ({
  sessionId,
  setData,
}: {
  sessionId: string;
  setData: Dispatch<SetStateAction<ILocalStorageLog[]>>;
}) => {
  const client = await getSpectraClient();

  const { unsubscribe } = client
    .subscription(localStorageLogs, {
      sessionId,
    })
    .subscribe(({ data, error }) => {
      if (error) processServerError(error);

      setData(data?.local_storage_metrics || []);
    });

  return unsubscribe;
};
