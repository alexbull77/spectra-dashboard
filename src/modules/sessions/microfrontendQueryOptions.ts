import { fetchMicrofrontends } from "@/api";
import { queryOptions } from "@tanstack/react-query";

export const microfrontendQueryOptions = {
  all: ["allMicrofrontends"],

  microfrontends: (sessionId?: string) =>
    queryOptions({
      queryKey: [...microfrontendQueryOptions.all, sessionId],
      queryFn: () => fetchMicrofrontends({ sessionId }),
      initialData: [],
      enabled: !!sessionId,
    }),
};
