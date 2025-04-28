import { IFps, subscribeToFps } from "@/api";
import { useEffect, useState } from "react";

export const useSubscribeToFps = (sessionId: string) => {
  const [data, setData] = useState<IFps[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined = undefined;

    subscribeToFps({ sessionId, setData }).then(
      (_unsubscribe) => (unsubscribe = _unsubscribe)
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [sessionId]);

  return { data };
};
