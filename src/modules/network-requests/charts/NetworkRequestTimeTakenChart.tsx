import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { observer } from "mobx-react-lite";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { useNetworkRequestsStore } from "../mst/NetworkRequestContext";
import { differenceInSeconds, parseISO } from "date-fns";
import { toast } from "sonner";
import { bad, good } from "@/helpers/colors";

const generateChartConfig = (
  requestsTimeTaken: {
    created_at: string;
    id: string;
    time_taken_ms: number;
    fill: string;
  }[]
) => {
  const config: ChartConfig = {};

  requestsTimeTaken.forEach((item) => {
    config[item.id] = {
      label: item.id,
      color: item.fill,
    };
  });

  return config;
};

export const NetworkRequestTimeTakenChart = observer(() => {
  const { requestsTimeTaken, settings } = useNetworkRequestsStore();

  const chartConfig = generateChartConfig(requestsTimeTaken);

  return (
    <div className="w-[700px]">
      <Card>
        <CardHeader>
          <CardTitle>Repeated requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={requestsTimeTaken}>
              <CartesianGrid vertical={false} />
              <YAxis
                dataKey="time_taken_ms"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value} ms`}
              />

              <XAxis
                dataKey="created_at"
                tickLine={false}
                dy={10}
                axisLine={false}
                tickMargin={8}
                label={"Seconds from now"}
                tickFormatter={(value) => {
                  return `-${differenceInSeconds(new Date(), parseISO(value))}`;
                }}
              />

              <ChartTooltip
                cursor={false}
                content={(props) => {
                  const request = requestsTimeTaken.find(
                    (r) => props.label === r.created_at
                  );

                  return (
                    <div className="bg-white border border-delta-200 p-4">
                      {request?.id}
                    </div>
                  );
                }}
              />
              <Bar
                onClick={(data) => {
                  navigator.clipboard.writeText(data.payload.id);
                  toast("Request id copied to clipboard");
                }}
                dataKey="time_taken_ms"
                type="natural"
              />

              {settings?.request_threshold_bad_ms && (
                <ReferenceLine
                  y={settings.request_threshold_bad_ms}
                  strokeWidth={4}
                  stroke={bad}
                  strokeDasharray="3 3"
                  label={{
                    value: "Bad Request Threshold",
                    position: "insideTopRight",
                    fontSize: 14,
                  }}
                />
              )}

              {settings?.request_threshold_good_ms && (
                <ReferenceLine
                  y={settings.request_threshold_good_ms}
                  stroke={good}
                  strokeWidth={4}
                  strokeDasharray="3 3"
                  label={{
                    value: "Good Request Threshold",
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
});
