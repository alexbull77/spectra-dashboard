import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { differenceInSeconds, parseISO } from "date-fns";
import { useSubscribeToEventLoopLogs } from "./useSubscribeToEventLoopLogs";
import { IEventLoopLog } from "@/api";
import { observer } from "mobx-react-lite";
import { useNetworkRequestsStore } from "@/modules/network-requests/mst/NetworkRequestContext";
import { bad, good } from "@/helpers/colors";

const generateChartConfig = (
  eventLoopLogs: (IEventLoopLog & { fill: string })[]
) => {
  const config: ChartConfig = {};

  eventLoopLogs.forEach((item) => {
    config[item.id] = {
      label: item.id,
      color: item.fill,
    };
  });

  return config;
};
export const EventLoopChart: React.FC<{ sessionId: string }> = observer(
  ({ sessionId }) => {
    const { data } = useSubscribeToEventLoopLogs(sessionId);
    const { settings, getEventLoopLogsChartData } = useNetworkRequestsStore();

    const chartData = getEventLoopLogsChartData(data);
    const chartConfig = generateChartConfig(chartData);

    return (
      <div className="w-[700px]">
        <Card>
          <CardHeader>
            <CardTitle>Event loop events</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />

                <YAxis
                  dataKey="duration_ms"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value} ms`}
                />

                <XAxis
                  dataKey="recorded_at"
                  tickLine={false}
                  dy={10}
                  axisLine={false}
                  tickMargin={8}
                  label={"Seconds from now"}
                  tickFormatter={(value) => {
                    return `${differenceInSeconds(new Date(), parseISO(value))}`;
                  }}
                />

                <ChartTooltip
                  cursor={false}
                  content={(props) => {
                    const event = data.find(
                      (r) => props.label === r.recorded_at
                    );

                    if (!event) return null;

                    return (
                      <div className="bg-white border border-delta-200 p-4 rounded-md flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-2">
                          <div className="font-semibold">Type: </div>
                          <div>{event.type}</div>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <div className="font-semibold">Duration: </div>
                          <div>{event.duration_ms} ms</div>
                        </div>
                      </div>
                    );
                  }}
                />

                <Bar dataKey="duration_ms" type="natural" />

                {settings?.event_loop_delay_bad_ms && (
                  <ReferenceLine
                    y={settings.event_loop_delay_bad_ms}
                    strokeWidth={4}
                    stroke={bad}
                    strokeDasharray="3 3"
                    label={{
                      value: "Bad",
                      position: "insideTopRight",
                      fontSize: 14,
                    }}
                  />
                )}

                {settings?.event_loop_delay_good_ms && (
                  <ReferenceLine
                    y={settings.event_loop_delay_good_ms}
                    stroke={good}
                    strokeWidth={4}
                    strokeDasharray="3 3"
                    label={{
                      value: "Good",
                      position: "insideTopRight",
                      fontSize: 14,
                    }}
                  />
                )}
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    );
  }
);
