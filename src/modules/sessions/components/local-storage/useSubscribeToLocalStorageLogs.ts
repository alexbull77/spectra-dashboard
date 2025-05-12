import { ILocalStorageLog, subscribeToLocalStorageLogs } from "@/api";
import { useEffect, useState } from "react";

export const useSubscribeToLocalStorageLogs = (sessionId: string) => {
  const [data, setData] = useState<ILocalStorageLog[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined = undefined;

    subscribeToLocalStorageLogs({ sessionId, setData }).then(
      (_unsubscribe) => (unsubscribe = _unsubscribe)
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [sessionId]);

  return { data };
};
