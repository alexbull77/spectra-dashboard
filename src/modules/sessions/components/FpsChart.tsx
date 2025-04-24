"use client";

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { differenceInSeconds, parseISO } from "date-fns";
import { useSubscribeToFps } from "./useSubscribeToFps";

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

export const FpsChart: React.FC<{
  sessionId: string;
}> = ({ sessionId }) => {
  const { data } = useSubscribeToFps(sessionId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fps Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 30,
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
              dataKey="fps"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Line
              dataKey="fps"
              type="natural"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-chart-1)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
