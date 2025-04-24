import { IMemoryLog, subscribeToMemoryLogs } from "@/api";
import { useEffect, useState } from "react";

export const useSubscribeToMemoryLogs = (sessionId: string) => {
  const [data, setData] = useState<IMemoryLog[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined = undefined;

    subscribeToMemoryLogs({ sessionId, setData }).then(
      (_unsubscribe) => (unsubscribe = _unsubscribe)
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [sessionId]);

  return { data };
};
