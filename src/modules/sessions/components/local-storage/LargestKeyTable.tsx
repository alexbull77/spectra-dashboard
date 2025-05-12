import { ILocalStorageLog } from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { differenceInSeconds, parseISO } from "date-fns";

export const LargestKeyTable = ({ data }: { data: ILocalStorageLog[] }) => {
  return (
    <Card className="w-[450px] h-fit">
      <CardHeader>
        <CardTitle>Largest Keys</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <DataTable
          data={data.slice(0, 5)}
          columns={[
            {
              accessorKey: "recorded_at",
              header: () => <div className="text-right">Seconds from now</div>,
              cell: ({
                row: {
                  original: { recorded_at },
                },
              }) => (
                <div>
                  {differenceInSeconds(new Date(), parseISO(recorded_at))}
                </div>
              ),
            },
            {
              accessorKey: "largest_key",
              header: () => <div className="text-right">Key</div>,
              cell: ({
                row: {
                  original: { largest_key },
                },
              }) => <div>{largest_key}</div>,
            },
            {
              accessorKey: "largest_key_size_kb",
              header: () => <div className="text-right">Size (KB)</div>,
              cell: ({
                row: {
                  original: { largest_key_size_kb },
                },
              }) => <div>{largest_key_size_kb.toFixed(2)}</div>,
            },
          ]}
          showPagination={false}
        />
      </CardContent>
    </Card>
  );
};
