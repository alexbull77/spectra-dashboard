import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LargestKeyTable } from "./LargestKeyTable";
import { QuotaUsedChart } from "./QuotaUsedChart";
import { ReadWriteOpsChart } from "./ReadWriteOpsChart";
import { useSubscribeToLocalStorageLogs } from "./useSubscribeToLocalStorageLogs";

export const LocalStorageWidget: React.FC<{ sessionId: string }> = ({
  sessionId,
}) => {
  const { data } = useSubscribeToLocalStorageLogs(sessionId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Storage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-8">
          <QuotaUsedChart data={data} />
          <ReadWriteOpsChart data={data} />
          <LargestKeyTable data={data} />
        </div>
      </CardContent>
    </Card>
  );
};
