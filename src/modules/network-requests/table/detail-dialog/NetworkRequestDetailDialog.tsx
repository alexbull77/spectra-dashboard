import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactJson from "react-json-view";
import { HeadersTab } from "./components/HeadersTab";
import { RequestTab } from "./components/RequestTab";
import { useNetworkRequestsStore } from "../../mst/NetworkRequestContext";
import { observer } from "mobx-react-lite";

export const NetworkRequestDetailDialog = observer(() => {
  const { selected_request, onChangeField } = useNetworkRequestsStore();
  return (
    <Dialog
      open={!!selected_request}
      onOpenChange={(open) =>
        !open && onChangeField("selected_request", undefined)
      }
    >
      <DialogContent className="min-w-screen max-w-screen min-h-screen max-h-screen flex flex-col gap-y-10 overflow-y-scroll">
        <DialogHeader className=" h-fit pt-10">
          <DialogTitle>Network Request Details</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-screen h-full">
          <TabsList defaultValue="headers">
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <HeadersTab />
          <RequestTab />

          <TabsContent value="response">
            <div className="flex flex-col gap-y-2">
              <div className="flex gap-x-2 items-center">
                <div className="font-semibold">STATUS:</div>
                <div>{selected_request?.status}</div>
              </div>

              <div className="flex gap-x-2 items-center">
                <div className="font-semibold">SIZE:</div>
                <div>{selected_request?.response_size_bytes} bytes</div>
              </div>

              <div className="flex gap-x-2 items-center">
                <div className="font-semibold">TIME TAKEN:</div>
                <div>{selected_request?.time_taken_ms} ms</div>
              </div>

              <div>
                <div className="font-semibold">Body:</div>
                <ReactJson
                  src={JSON.parse(selected_request?.response_body || "{}")}
                  name={false}
                  displayDataTypes={false}
                  collapseStringsAfterLength={50}
                  style={{ fontSize: "14px" }}
                  enableClipboard={(copy) =>
                    navigator.clipboard.writeText(
                      JSON.stringify(copy.src, null, "\t")
                    )
                  }
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="other"></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});
