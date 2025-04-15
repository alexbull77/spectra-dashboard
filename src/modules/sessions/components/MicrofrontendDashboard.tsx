import { NetworkRequestsIndex } from "@/modules/network-requests/NetworkRequestsIndex";

export const MicrofrontendDashboard: React.FC<{
  microfrontendId: string;
  sessionId: string;
}> = ({ sessionId, microfrontendId }) => {
  return (
    <NetworkRequestsIndex
      sessionId={sessionId}
      microfrontendId={microfrontendId}
    />
  );
};
