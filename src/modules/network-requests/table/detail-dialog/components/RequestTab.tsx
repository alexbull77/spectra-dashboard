import { TabsContent } from "@/components/ui/tabs";
import { formatGraphQL } from "@/helpers/formatGraphQL";
import { useNetworkRequestsStore } from "@/modules/network-requests/mst/NetworkRequestContext";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ReactJson from "react-json-view";

export const RequestTab = observer(() => {
  const { selected_request } = useNetworkRequestsStore();
  const [formattedQuery, setFormattedQuery] = useState<string>("");

  useEffect(() => {
    const parseAndFormatQuery = async () => {
      if (!selected_request?.payload) return;

      try {
        const parsedPayload = JSON.parse(JSON.parse(selected_request.payload));
        if (parsedPayload?.query) {
          const formatted = await formatGraphQL(parsedPayload.query);
          setFormattedQuery(formatted);
        } else {
          setFormattedQuery("");
        }
      } catch (e) {
        console.error("Failed to parse/format GraphQL query", e);
        setFormattedQuery("");
      }
    };

    parseAndFormatQuery();
  }, [selected_request?.payload]);

  return (
    <TabsContent value="request">
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center className='flex gap-x-2 items-center'">
          <div className="font-semibold">URL:</div>
          <div>{selected_request?.url}</div>
        </div>

        <div className="flex items-center className='flex gap-x-2 items-center'">
          <div className="font-semibold">METHOD: </div>
          <div>{selected_request?.method}</div>
        </div>

        <div>
          <div className="font-semibold">Payload:</div>
          <ReactJson
            src={JSON.parse(
              selected_request?.payload
                ? JSON.stringify(
                    JSON.parse(JSON.parse(selected_request?.payload)),
                    null,
                    2
                  )
                : "{}"
            )}
            enableClipboard={(copy) =>
              navigator.clipboard.writeText(
                JSON.stringify(copy.src, null, "\t")
              )
            }
            name={false}
            displayDataTypes={false}
            collapseStringsAfterLength={50}
            style={{ fontSize: "14px" }}
          />
        </div>

        {formattedQuery && (
          <div className="flex flex-col gap-1">
            <div className="font-semibold">Formatted GraphQL Query:</div>
            <pre className="bg-gray-100 text-sm p-3 rounded-md overflow-auto whitespace-pre-wrap w-fit">
              {formattedQuery}
            </pre>
          </div>
        )}
      </div>
    </TabsContent>
  );
});
