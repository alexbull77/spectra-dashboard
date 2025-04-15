import { fetchSessions } from "@/api";
import { queryOptions } from "@tanstack/react-query";

export const sessionQueryOptions = {
  all: ["allSessions"],

  sessions: (user_id?: string) =>
    queryOptions({
      queryKey: [...sessionQueryOptions.all, user_id],
      queryFn: () => fetchSessions({ user_id }),
      initialData: [],
    }),
};
