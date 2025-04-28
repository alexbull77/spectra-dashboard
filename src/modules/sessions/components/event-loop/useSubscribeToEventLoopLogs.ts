import { IEventLoopLog, subscribeToEventLoopLogs } from "@/api";
import { useEffect, useState } from "react";

export const useSubscribeToEventLoopLogs = (sessionId: string) => {
  const [data, setData] = useState<IEventLoopLog[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined = undefined;

    subscribeToEventLoopLogs({ sessionId, setData }).then(
      (_unsubscribe) => (unsubscribe = _unsubscribe)
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [sessionId]);

  return { data };
};
