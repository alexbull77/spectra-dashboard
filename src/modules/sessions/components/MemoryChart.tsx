import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { differenceInSeconds, parseISO } from "date-fns";
import { useSubscribeToMemoryLogs } from "./useSubscribeToMemoryLogs";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const MemoryChart: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const { data } = useSubscribeToMemoryLogs(sessionId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory used (Node)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="recorded_at"
              tickLine={false}
              dy={20}
              axisLine={false}
              tickMargin={8}
              label={"Seconds from now"}
              tickFormatter={(value) => {
                return `-${differenceInSeconds(new Date(), parseISO(value))}`;
              }}
            />
            <YAxis
              dataKey="heap_limit"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="heap_limit"
              type="natural"
              fill="var(--color-chart-1)"
              fillOpacity={0.4}
              stroke="var(--color-chart-1)"
              stackId="a"
            />
            <Area
              dataKey="js_heap_limit_mb"
              type="natural"
              fill="var(--color-chart-2)"
              fillOpacity={0.4}
              stroke="var(--color-chart-2)"
              stackId="a"
            />
            <Area
              dataKey="js_heap_total_mb"
              type="natural"
              fill="var(--color-chart-3)"
              fillOpacity={0.4}
              stroke="var(--color-chart-3)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
