import { observer } from "mobx-react-lite";
import { useNetworkRequestsStore } from "../mst/NetworkRequestContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { toast } from "sonner";

const generateChartConfig = (
  heatmap: {
    url: string;
    count: number;
    fill: string;
  }[]
) => {
  const config: ChartConfig = {};

  heatmap.forEach((item) => {
    config[item.url] = {
      label: item.url,
      color: item.fill,
    };
  });

  return config;
};

export const NetworkRequestUrlHeatmap = observer(() => {
  const { urlHeatmap } = useNetworkRequestsStore();

  const chartConfig = generateChartConfig(urlHeatmap);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Endpoint Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={chartConfig}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={urlHeatmap}
                dataKey="count"
                nameKey="url"
                stroke="0"
                onClick={(data) => {
                  navigator.clipboard.writeText(data.payload.url);
                  toast("URL copied to clipboard");
                }}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
});
