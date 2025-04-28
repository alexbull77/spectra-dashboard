import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { observer } from "mobx-react-lite";
import { Bar, BarChart, CartesianGrid, ReferenceLine, YAxis } from "recharts";
import { useNetworkRequestsStore } from "../mst/NetworkRequestContext";
import { toast } from "sonner";
import { bad, good } from "@/helpers/colors";

const generateChartConfig = (
  repeatedNetworkRequests: {
    request_ids: string[];
    count: number;
    fill: string;
  }[]
) => {
  const config: ChartConfig = {};

  repeatedNetworkRequests.forEach((item) => {
    const label = item.request_ids.join(", ");
    config[label] = {
      label: label,
      color: item.fill,
    };
  });

  return config;
};

export const RepeatedNetworkRequestsChart = observer(() => {
  const { repeatedRequestsByPayload } = useNetworkRequestsStore();

  const chartConfig = generateChartConfig(repeatedRequestsByPayload);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Repeated requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={repeatedRequestsByPayload}>
              <CartesianGrid vertical={false} />
              <YAxis
                dataKey="count"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
              />

              <ChartTooltip
                cursor={false}
                content={(props) => {
                  const requestIds: string[] | undefined =
                    props.payload?.[0]?.payload?.request_ids;

                  if (!Array.isArray(requestIds) || requestIds.length === 0)
                    return null;

                  return (
                    <div className="bg-white border border-delta-200 rounded-md shadow-md p-4 space-y-1">
                      <h4 className="text-sm font-semibold text-delta-600 mb-2">
                        Request IDs
                      </h4>
                      {requestIds.map((id) => (
                        <div
                          key={id}
                          className="text-xs text-delta-800 bg-delta-100 px-2 py-1 rounded"
                        >
                          {id}
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Bar
                onClick={(data) => {
                  navigator.clipboard.writeText(data?.request_ids?.[0]);
                  toast("First request id copied to clipboard");
                }}
                dataKey="count"
                type="natural"
              />

              <ReferenceLine
                y={1}
                strokeWidth={4}
                stroke={good}
                strokeDasharray="3 3"
                label={{
                  value: "Good",
                  position: "insideTopRight",
                  fontSize: 14,
                }}
              />

              <ReferenceLine
                y={3}
                stroke={bad}
                strokeWidth={4}
                strokeDasharray="3 3"
                label={{
                  value: "Bad",
                  position: "insideTopRight",
                  fontSize: 14,
                }}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
});
