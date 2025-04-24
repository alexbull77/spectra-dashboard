import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, ResultOf } from "../client";
import { Dispatch, SetStateAction } from "react";

const fpsSubscription = graphql(`
  subscription fpsSubscription($sessionId: uuid!) {
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

export type IFps = ResultOf<typeof fpsSubscription>["fps_logs"][0];

export const subscribeToFps = async ({
  sessionId,
  setData,
}: {
  sessionId: string;
  setData: Dispatch<SetStateAction<IFps[]>>;
}) => {
  const client = await getSpectraClient();

  const { unsubscribe } = client
    .subscription(fpsSubscription, {
      sessionId,
    })
    .subscribe(({ data, error }) => {
      if (error) processServerError(error);

      setData(data?.fps_logs || []);
    });

  return unsubscribe;
};
