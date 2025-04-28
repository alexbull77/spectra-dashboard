import { NetworkRequestTable } from "./table/NetworkRequestTable";
import { observer } from "mobx-react-lite";
import { useInitNetworkRequests } from "./useInitNetworkRequests";
import { DraggableRequestWidgets } from "./DraggableRequestWidgets";

export const NetworkRequestsIndex: React.FC<{
  sessionId: string;
  microfrontendId: string;
}> = observer(({ sessionId, microfrontendId }) => {
  useInitNetworkRequests(sessionId, microfrontendId);

  return (
    <>
      <DraggableRequestWidgets />
      <NetworkRequestTable />
    </>
  );
});
