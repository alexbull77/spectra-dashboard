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
    response_size_bytes: number;
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

export const NetworkResponseSizeChart = observer(() => {
  const { responseSize, settings } = useNetworkRequestsStore();

  const chartConfig = generateChartConfig(responseSize);

  return (
    <div className="w-[700px]">
      <Card>
        <CardHeader>
          <CardTitle>Payload size</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={responseSize}>
              <CartesianGrid vertical={false} />
              <YAxis
                dy={10}
                dx={10}
                dataKey="response_size_bytes"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value / 1000}kb`}
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
                  const request = responseSize.find(
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
                dataKey="response_size_bytes"
                type="natural"
              />

              {settings?.payload_threshold_large_kb && (
                <ReferenceLine
                  y={settings.payload_threshold_large_kb * 1000}
                  strokeWidth={4}
                  stroke={bad}
                  strokeDasharray="3 3"
                  label={{
                    value: "Bad Payload Threshold",
                    position: "insideTopRight",
                    fontSize: 14,
                  }}
                />
              )}

              {settings?.payload_threshold_ok_kb && (
                <ReferenceLine
                  y={settings.payload_threshold_ok_kb * 1000}
                  stroke={good}
                  strokeWidth={4}
                  strokeDasharray="3 3"
                  label={{
                    value: "Good Payload Threshold",
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
