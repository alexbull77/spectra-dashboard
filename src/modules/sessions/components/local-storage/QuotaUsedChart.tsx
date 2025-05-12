import { AreaChart, Area, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ILocalStorageLog } from "@/api";

export const QuotaUsedChart = ({ data }: { data: ILocalStorageLog[] }) => {
  const min = Math.min(...data.map((d) => d.quota_used_percentage ?? 0));
  const max = Math.max(...data.map((d) => d.quota_used_percentage ?? 0));

  const margin = 5;
  return (
    <Card className="w-[450px] h-fit">
      <CardHeader>
        <CardTitle>Quota Used (%)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            quota_used_percent: {
              label: "Quota Used",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <YAxis
              domain={[
                Math.max(0, Math.floor(min - margin)),
                Math.min(100, Math.ceil(max + margin)),
              ]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              unit="%"
            />

            <ChartTooltip
              cursor={false}
              content={(props) => {
                const percentage =
                  props.payload?.[0]?.payload.quota_used_percentage;

                return (
                  <div className="bg-white border border-delta-200 rounded-md shadow-md p-4">
                    <div className="text-sm flex text-delta-600 mb-2 gap-2">
                      <span className="font-semibold">Used:</span>
                      <span>{percentage}%</span>
                    </div>
                  </div>
                );
              }}
            />

            <Area
              dataKey="quota_used_percentage"
              type="monotone"
              fill="var(--color-chart-1)"
              fillOpacity={0.4}
              stroke="var(--color-chart-1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
