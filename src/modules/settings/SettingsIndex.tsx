import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { settingsQueryOptions } from "./settingsQueryOptions";
import { useUser } from "@clerk/clerk-react";
import { upsertUserSettings } from "@/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const SettingsIndex = () => {
  const [badRequestThreshold, setBadRequestThreshold] = useState<number>(0);
  const [goodRequestThreshold, setGoodRequestThreshold] = useState<number>(0);
  const [badPayloadThreshold, setBadPayloadThreshold] = useState<number>(0);
  const [goodEventLoopDuration, setGoodEventLoopDuration] = useState<number>(0);
  const [badEventLoopDuration, setBadEventLoopDuration] = useState<number>(0);
  const [goodPayloadThreshold, setGoodPayloadThreshold] = useState<number>(0);
  const [chartRangeMinutes, setChartRangeMinutes] = useState<number>(0);
  const [repetitionIntervalSeconds, setRepetitionIntervalSeconds] =
    useState<number>(0);

  const { user } = useUser();
  const { data: settings, isFetching } = useQuery(
    settingsQueryOptions.settings(user?.id)
  );

  const { mutate: save, isPending } = useMutation({
    mutationKey: settingsQueryOptions.all,
    mutationFn: () =>
      upsertUserSettings({
        user_id: user?.id,
        default_time_range_minutes: chartRangeMinutes,
        payload_threshold_large_kb: badPayloadThreshold,
        payload_threshold_ok_kb: goodPayloadThreshold,
        request_threshold_bad_ms: badRequestThreshold,
        request_threshold_good_ms: goodRequestThreshold,
        allowed_repetition_interval_seconds: repetitionIntervalSeconds,
        event_loop_delay_bad_ms: badEventLoopDuration,
        event_loop_delay_good_ms: goodEventLoopDuration,
      }),
    onSuccess: () => toast("Settings successfully saved"),
  });

  useEffect(() => {
    setBadRequestThreshold(settings?.request_threshold_bad_ms || 0);
    setGoodRequestThreshold(settings?.request_threshold_good_ms || 0);
    setBadPayloadThreshold(settings?.payload_threshold_large_kb || 0);
    setGoodPayloadThreshold(settings?.payload_threshold_ok_kb || 0);
    setChartRangeMinutes(settings?.default_time_range_minutes || 0);
    setGoodEventLoopDuration(settings?.event_loop_delay_good_ms || 0);
    setBadEventLoopDuration(settings?.event_loop_delay_bad_ms || 0);
  }, [settings]);

  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center px-4 w-screen">
      <div className="absolute top-4 left-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft />
          <span>Back</span>
        </Button>
      </div>
      <div className="w-full h-[calc(100vh-50px)] flex flex-col gap-y-8 max-w-[600px] border-x border-gray-200 pt-8 px-4">
        <div className="font-semibold text-2xl">Settings</div>

        <div className="flex flex-col gap-y-2">
          <div className="font-semibold">Request threshold (ms)</div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="badRequestThreshold">Bad</Label>
              <Input
                disabled={isPending || isFetching}
                className="w-fit"
                id="badRequestThreshold"
                value={badRequestThreshold}
                type="number"
                onChange={(e) => setBadRequestThreshold(+e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="goodRequestThreshold">Good</Label>
              <Input
                disabled={isPending || isFetching}
                className="w-fit"
                id="goodRequestThreshold"
                value={goodRequestThreshold}
                type="number"
                onChange={(e) => setGoodRequestThreshold(+e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="font-semibold">Payload threshold (kb)</div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="badPayloadThreshold">Bad</Label>
              <Input
                disabled={isPending || isFetching}
                className="w-fit"
                id="badPayloadThreshold"
                value={badPayloadThreshold}
                type="number"
                onChange={(e) => setBadPayloadThreshold(+e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="goodPayloadThreshold">Good</Label>
              <Input
                disabled={isPending || isFetching}
                className="w-fit"
                id="goodPayloadThreshold"
                value={goodPayloadThreshold}
                type="number"
                onChange={(e) => setGoodPayloadThreshold(+e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-y-2">
            <div className="font-semibold">Chart time range (minutes)</div>
            <Input
              disabled={isPending || isFetching}
              className="w-fit"
              id="chartRangeMinutes"
              value={chartRangeMinutes}
              type="number"
              onChange={(e) => setChartRangeMinutes(+e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-y-2">
            <div className="font-semibold">
              Allowed repetition interval (seconds)
            </div>
            <Input
              disabled={isPending || isFetching}
              className="w-fit"
              id="repetitionIntervalSeconds"
              value={repetitionIntervalSeconds}
              type="number"
              onChange={(e) => setRepetitionIntervalSeconds(+e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="font-semibold">Event loop event duration (ms)</div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="badEventLoopDuration">Bad</Label>
              <Input
                disabled={isPending || isFetching}
                className="w-fit"
                id="badEventLoopDuration"
                value={badEventLoopDuration}
                type="number"
                onChange={(e) => setBadEventLoopDuration(+e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="goodEventLoopDuration">Good</Label>
              <Input
                disabled={isPending || isFetching}
                className="w-fit"
                id="goodEventLoopDuration"
                value={goodEventLoopDuration}
                type="number"
                onChange={(e) => setGoodEventLoopDuration(+e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-end">
          <Button disabled={isFetching || isPending} onClick={() => save()}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
