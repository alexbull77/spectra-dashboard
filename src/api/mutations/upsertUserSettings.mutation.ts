import { processServerError } from "@/helpers/processServerError";
import { getSpectraClient, graphql, VariablesOf } from "../client";

const upsertUserSettingsMutation = graphql(`
  mutation upsertUserSettings($object: user_settings_insert_input!) {
    insert_user_settings_one(
      object: $object
      on_conflict: {
        constraint: user_settings_user_id_key
        update_columns: [
          default_time_range_minutes
          payload_threshold_large_kb
          payload_threshold_ok_kb
          request_threshold_bad_ms
          request_threshold_good_ms
          allowed_repetition_interval_seconds
          event_loop_delay_bad_ms
          event_loop_delay_good_ms
        ]
      }
    ) {
      id
    }
  }
`);

export const upsertUserSettings = async (
  object: VariablesOf<typeof upsertUserSettingsMutation>["object"]
) => {
  try {
    const client = await getSpectraClient();

    const { data, error } = await client.mutation(upsertUserSettingsMutation, {
      object,
    });

    if (error) processServerError(error);

    return data?.insert_user_settings_one?.id;
  } catch (e) {
    processServerError(e);
  }
};
