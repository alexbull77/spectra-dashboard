import { types } from "mobx-state-tree";
import { interpolateRainbow } from "d3-scale-chromatic";
import { bad, good, neutral } from "@/helpers/colors";
import { IEventLoopLog } from "../../../api/subscriptions/subscribeToEventLoopLogs.subscription";

export const NetworkRequest = types.model({
  id: types.identifier,
  url: "",
  method: "",
  status: 0,
  response_size_bytes: 0,
  time_taken_ms: 0,
  response_body: types.maybeNull(types.string),
  created_at: "",
  payload: types.maybeNull(types.string),
  headers: types.maybeNull(types.string),
});

export const UserSettings = types.model({
  default_time_range_minutes: types.maybeNull(types.number),
  payload_threshold_large_kb: types.maybeNull(types.number),
  payload_threshold_ok_kb: types.maybeNull(types.number),
  request_threshold_bad_ms: types.maybeNull(types.number),
  request_threshold_good_ms: types.maybeNull(types.number),
  allowed_repetition_interval_seconds: types.maybeNull(types.number),
  event_loop_delay_bad_ms: types.maybeNull(types.number),
  event_loop_delay_good_ms: types.maybeNull(types.number),
});

export const NetworkRequestsStore = types
  .model({
    requests: types.array(NetworkRequest),
    selected_request: types.safeReference(NetworkRequest),
    search: "",

    settings: types.maybe(UserSettings),
  })
  .views((self) => ({
    get filteredRequests() {
      let filtered = [...self.requests];

      if (self.settings?.default_time_range_minutes && self.requests.length) {
        const latestRequest = self.requests.reduce((latest, current) => {
          return new Date(current.created_at) > new Date(latest.created_at)
            ? current
            : latest;
        });

        const cutoff = new Date(
          new Date(latestRequest.created_at).getTime() -
            self.settings.default_time_range_minutes * 60 * 1000
        );

        filtered = filtered.filter((r) => {
          return new Date(r.created_at) >= cutoff;
        });
      }

      if (!self.search.length) return filtered;

      return filtered.filter((r) => {
        const searchLower = self.search.toLowerCase().trim();

        const urlMatch = r.url.toLowerCase().includes(searchLower);
        const statusMatch = r.status.toString().includes(searchLower);
        const methodMatch = r.method.toLowerCase().includes(searchLower);
        const idMatch = r.id.toLowerCase().includes(searchLower);

        return urlMatch || methodMatch || statusMatch || idMatch;
      });
    },

    get urlHeatmap() {
      const countsMap = new Map<
        string,
        { url: string; count: number; fill: string }
      >();

      this.filteredRequests.forEach((r) => {
        const key = r.url;
        if (!countsMap.has(key)) {
          countsMap.set(key, { url: r.url, count: 1, fill: "" });
        } else {
          countsMap.get(key)!.count += 1;
        }
      });

      const results = Array.from(countsMap.values());

      const total = results.length;
      results.forEach((item) => {
        item.fill = interpolateRainbow(item.count / total);
      });

      return results;
    },

    get requestsTimeTaken() {
      return this.filteredRequests.map((request) => {
        let fill = neutral;

        const badMs =
          self.settings?.request_threshold_bad_ms &&
          request.time_taken_ms > self.settings?.request_threshold_bad_ms;

        const goodMs =
          self.settings?.request_threshold_good_ms &&
          request.time_taken_ms < self.settings.request_threshold_good_ms;

        if (badMs) fill = bad;
        if (goodMs) fill = good;

        return {
          created_at: request.created_at,
          id: request.id,
          time_taken_ms: request.time_taken_ms,
          fill,
        };
      });
    },

    get responseSize() {
      return this.filteredRequests.map((request) => {
        let fill = neutral;

        const badPayload =
          self.settings?.payload_threshold_large_kb &&
          request.response_size_bytes / 1000 >
            self.settings.payload_threshold_large_kb;

        const goodPayload =
          self.settings?.payload_threshold_ok_kb &&
          request.response_size_bytes / 1000 <
            self.settings.payload_threshold_ok_kb;

        if (badPayload) fill = bad;
        if (goodPayload) fill = good;

        return {
          created_at: request.created_at,
          id: request.id,
          response_size_bytes: request.response_size_bytes,
          fill,
        };
      });
    },

    get repeatedRequestsByPayload() {
      const groups = new Map<string, string[]>(); // key = payload, value = array of request IDs

      this.filteredRequests.forEach((r) => {
        const payloadKey = r.payload || "";

        if (!groups.has(payloadKey)) {
          groups.set(payloadKey, [r.id]);
        } else {
          groups.get(payloadKey)!.push(r.id);
        }
      });

      return Array.from(groups.values()).map((ids) => {
        const count = ids.length;
        let fill = neutral;

        if (count === 1) fill = good;
        else if (count > 3) fill = bad;

        return {
          request_ids: ids,
          count,
          fill,
        };
      });
    },

    getEventLoopLogsChartData(logs: IEventLoopLog[]) {
      const chartData = logs.map((event) => {
        let fill = neutral;

        const badDuration =
          self.settings?.event_loop_delay_bad_ms &&
          event.duration_ms > self.settings.event_loop_delay_bad_ms;

        const goodDuration =
          self.settings?.event_loop_delay_good_ms &&
          event.duration_ms < self.settings.event_loop_delay_good_ms;

        if (badDuration) fill = bad;
        if (goodDuration) fill = good;

        return { ...event, fill };
      });

      return chartData;
    },
  }))
  .actions((self) => ({
    onChangeField<Key extends keyof typeof self>(
      key: Key,
      value: (typeof self)[Key]
    ) {
      self[key] = value;
    },
  }));

export const NetworkRequestsStoreInstance = NetworkRequestsStore.create();
