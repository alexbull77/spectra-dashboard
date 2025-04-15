import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, ResultOf } from "../client";

const fetchUserSettingsQuery = graphql(`
  query fetchUserSettings($user_id: String) {
    user_settings(where: { user_id: { _eq: $user_id } }, limit: 1) {
      id
      user_id
      default_time_range_minutes
      payload_threshold_large_kb
      payload_threshold_ok_kb
      request_threshold_bad_ms
      request_threshold_good_ms
      allowed_repetition_interval_seconds
    }
  }
`);

export type IUSerSettings = ResultOf<
  typeof fetchUserSettingsQuery
>["user_settings"][0];

export const fetchUserSettings = async ({ user_id }: { user_id?: string }) => {
  try {
    if (!user_id) return;
    const client = await getSpectraClient();

    const { data, error } = await client.query(fetchUserSettingsQuery, {
      user_id,
    });

    if (error) processServerError(error);

    return data?.user_settings?.[0];
  } catch (e) {
    processServerError(e);
    return;
  }
};
