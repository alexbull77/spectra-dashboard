import { fetchUserSettings } from "@/api";
import { queryOptions } from "@tanstack/react-query";

export const settingsQueryOptions = {
  all: ["allSettings"],

  settings: (user_id?: string) =>
    queryOptions({
      queryKey: [...settingsQueryOptions.all, user_id],
      queryFn: () => fetchUserSettings({ user_id }),
    }),
};
