import { subscribeToNetworkRequests } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { NetworkRequestsStoreInstance } from "./mst/NetworkRequests.store";
import { cast } from "mobx-state-tree";
import { settingsQueryOptions } from "../settings/settingsQueryOptions";
import { useUser } from "@clerk/clerk-react";

export const useInitNetworkRequests = (
  sessionId: string,
  microfrontendId: string
) => {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined = undefined;

    subscribeToNetworkRequests({
      sessionId,
      microfrontendId,
      setData: (fetchedRequests) => {
        NetworkRequestsStoreInstance.onChangeField(
          "requests",
          cast(fetchedRequests)
        );
      },
    }).then((_unsubscribe) => (unsubscribe = _unsubscribe));

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [sessionId, microfrontendId]);

  const { user } = useUser();
  const { data: settings } = useQuery(settingsQueryOptions.settings(user?.id));

  useEffect(() => {
    if (!settings) return;
    NetworkRequestsStoreInstance.onChangeField("settings", { ...settings });
  }, [settings]);
};
