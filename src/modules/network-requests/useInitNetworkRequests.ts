import { fetchNetworkRequests } from "@/api";
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
  const { data: fetchedRequests, isFetching: requestsFetching } = useQuery({
    queryKey: ["fetchNetworkRequests", sessionId, microfrontendId],
    queryFn: () => fetchNetworkRequests({ sessionId, microfrontendId }),
    initialData: [],
  });

  useEffect(() => {
    NetworkRequestsStoreInstance.onChangeField(
      "requests",
      cast(fetchedRequests)
    );
  }, [fetchedRequests]);

  const { user } = useUser();
  const { data: settings, isFetching: settingsFetching } = useQuery(
    settingsQueryOptions.settings(user?.id)
  );

  useEffect(() => {
    if (!settings) return;
    NetworkRequestsStoreInstance.onChangeField("settings", { ...settings });
  }, [settings]);

  return { isFetching: requestsFetching || settingsFetching };
};
