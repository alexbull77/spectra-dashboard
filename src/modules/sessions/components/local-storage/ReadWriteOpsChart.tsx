import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ILocalStorageLog } from "@/api";
import { differenceInSeconds, parseISO } from "date-fns";

export const ReadWriteOpsChart = ({ data }: { data: ILocalStorageLog[] }) => {
  return (
    <Card className="w-[450px] h-fit">
      <CardHeader>
        <CardTitle>Read vs Write Operations</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            read_ops: {
              label: "Read Ops",
              color: "hsl(var(--chart-2))",
            },
            write_ops: {
              label: "Write Ops",
              color: "hsl(var(--chart-3))",
            },
          }}
        >
          <BarChart data={data} margin={{ left: 12, right: 12, bottom: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="recorded_at"
              tickFormatter={(t) =>
                differenceInSeconds(new Date(), parseISO(t)).toString()
              }
              label="Seconds from now"
              tickMargin={8}
              dy={10}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="read_ops" fill="var(--color-chart-2)" stackId="a" />
            <Bar dataKey="write_ops" fill="var(--color-chart-3)" stackId="a" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
