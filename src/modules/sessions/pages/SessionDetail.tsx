import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MicrofrontendDashboard } from "../components/MicrofrontendDashboard";

import { DraggableWidgets } from "./DraggableWidgets";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import { microfrontendQueryOptions } from "../microfrontendQueryOptions";
import { deleteMicrofrontend } from "@/api";
import { toast } from "sonner";
import { ShareSessionDialog } from "../components/ShareSessionDialog";
import { sessionQueryOptions } from "../sessionQueryOptions";
import { useUser } from "@clerk/clerk-react";
import { NetworkRequestsProvider } from "@/modules/network-requests/mst/NetworkRequestContext";
import { LocalStorageWidget } from "../components/local-storage/LocalStorageWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SessionDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [selectedMicrofrontendId, setSelectedMicrofrontendId] = useState<
    string | undefined
  >();

  const { data: microfrontends, isFetching } = useQuery(
    microfrontendQueryOptions.microfrontends(sessionId)
  );

  const { mutate: deleteMf } = useMutation({
    mutationKey: microfrontendQueryOptions.all,
    mutationFn: deleteMicrofrontend,
  });

  useEffect(() => {
    setSelectedMicrofrontendId(microfrontends?.[0]?.id);
  }, [microfrontends]);

  const { user } = useUser();
  const { data: sessions } = useQuery(sessionQueryOptions.sessions(user?.id));

  if (!sessionId) return null;

  const isOwner =
    sessions.find((s) => s.id === sessionId)?.user_id === user?.id;

  return (
    <NetworkRequestsProvider>
      <div className="flex flex-col p-8 w-screen min-h-[calc(100vh-50px)] gap-y-8">
        <div className="flex gap-4 items-center flex-wrap">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft />
            <span>Back</span>
          </Button>
          <h2 className="text-2xl font-bold">Session: </h2>
          <h2 className="text-2xl text-gray-700">{sessionId}</h2>
          <ShareSessionDialog sessionId={sessionId} disabled={!isOwner} />
        </div>

        <DraggableWidgets sessionId={sessionId} />
        <LocalStorageWidget sessionId={sessionId} />

        <Card>
          <CardHeader>
            <CardTitle>Network Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {!microfrontends.length && !isFetching ? (
              <div className="text-center text-gray-500 text-lg mb-6">
                No microfrontends detected. Please use provided session ID to
                track some.
              </div>
            ) : (
              <Tabs
                value={selectedMicrofrontendId}
                className="border border-gray-300 rounded-xl p-4 shadow-xl"
              >
                <TabsList className="w-full border border-gray-300">
                  {microfrontends.map(({ id, name, version }) => (
                    <div className="w-full flex items-center" key={id}>
                      <TabsTrigger
                        key={id}
                        value={id}
                        onClick={() => setSelectedMicrofrontendId(id)}
                      >
                        <span>{`${name} (${version})`}</span>
                      </TabsTrigger>
                      <Button
                        disabled={!isOwner}
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMf(id, {
                            onSuccess: () =>
                              toast("Microfrontend successfully deleted"),
                          });
                        }}
                      >
                        <Trash className="text-red-500" />
                      </Button>
                    </div>
                  ))}
                </TabsList>
                {microfrontends.map(({ id }) => (
                  <TabsContent value={id} key={id}>
                    <MicrofrontendDashboard
                      microfrontendId={id}
                      sessionId={sessionId}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </NetworkRequestsProvider>
  );
};
