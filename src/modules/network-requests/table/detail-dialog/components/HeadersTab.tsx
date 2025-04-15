import { TabsContent } from "@/components/ui/tabs";
import ReactJson from "react-json-view";
import { jwtDecode } from "jwt-decode";
import { observer } from "mobx-react-lite";
import { useNetworkRequestsStore } from "@/modules/network-requests/mst/NetworkRequestContext";

export const HeadersTab = observer(() => {
  const { selected_request } = useNetworkRequestsStore();
  if (!selected_request) return null;

  const headersObj = JSON.parse(selected_request?.headers || "{}");

  const decodedJwt = jwtDecode(headersObj?.authorization.split(" ")[1]);

  return (
    <TabsContent value="headers">
      <div className="flex flex-col gap-y-2">
        <ReactJson
          collapseStringsAfterLength={50}
          src={headersObj}
          name={false}
          displayDataTypes={false}
          style={{ fontSize: "14px" }}
          enableClipboard={(copy) =>
            navigator.clipboard.writeText(JSON.stringify(copy.src, null, "\t"))
          }
        />
        {decodedJwt && (
          <div>
            <div className="font-semibold">Decoded JWT</div>
            <ReactJson
              src={decodedJwt}
              name={false}
              displayDataTypes={false}
              style={{ fontSize: "13px" }}
              collapsed={false}
            />
          </div>
        )}
      </div>
    </TabsContent>
  );
});
