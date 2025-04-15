import { DataTable } from "@/components/ui/data-table";

import { NetworkRequestDetailDialog } from "./detail-dialog/NetworkRequestDetailDialog";
import { useColumns } from "./useColumns";
import { useNetworkRequestsStore } from "../mst/NetworkRequestContext";
import { observer } from "mobx-react-lite";
import { Input } from "@/components/ui/input";

export const NetworkRequestTable: React.FC<{
  isFetching: boolean;
}> = observer(({ isFetching }) => {
  const { onChangeField, filteredRequests, search, settings } =
    useNetworkRequestsStore();

  const columns = useColumns();

  return (
    <div className="flex flex-col gap-y-2">
      <NetworkRequestDetailDialog />
      <div className="flex flex-col items-end justify-end gap-y-2">
        <Input
          className="w-[200px]"
          placeholder="Search requests"
          id="name"
          value={search}
          onChange={(e) => onChangeField("search", e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredRequests.slice()}
        isFetching={isFetching}
        onRowClick={(row) => onChangeField("selected_request", row)}
        cellClassNameOverrides={[
          {
            cell: "size",
            getCellClassName: (row) => {
              const badPayload =
                settings?.payload_threshold_large_kb &&
                row.response_size_bytes / 1000 >
                  settings.payload_threshold_large_kb;

              if (badPayload) return `bg-[#ef4444]`;

              const goodPayload =
                settings?.payload_threshold_ok_kb &&
                row.response_size_bytes / 1000 <
                  settings.payload_threshold_ok_kb;

              if (goodPayload) return `bg-[#10b981]`;

              return "";
            },
          },
          {
            cell: "time_taken",
            getCellClassName: (row) => {
              const badMs =
                settings?.request_threshold_bad_ms &&
                row.time_taken_ms > settings?.request_threshold_bad_ms;
              if (badMs) return `bg-[#ef4444]`;

              const goodMs =
                settings?.request_threshold_good_ms &&
                row.time_taken_ms < settings.request_threshold_good_ms;

              if (goodMs) return `bg-[#10b981]`;

              return "";
            },
          },
        ]}
      />
    </div>
  );
});
