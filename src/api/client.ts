import { initGraphQLTada } from "gql.tada";
import { introspection } from "../../generated/spectra-graphql-env";
import {
  Client,
  ClientOptions,
  createClient,
  fetchExchange,
  subscriptionExchange,
} from "@urql/core";
import { createClient as createWSClient } from "graphql-ws";

const initTadaClient = ({
  clientOptions,
  url,
  secret,
}: {
  clientOptions?: Partial<ClientOptions>;
  url: string;
  secret: string;
}) => {
  let tadaClient: Client | undefined = undefined;

  const getClient = async (): Promise<Client> => {
    if (!tadaClient) {
      tadaClient = await createTadaClient({ clientOptions });
    }
    return tadaClient;
  };

  async function createTadaClient({
    clientOptions,
  }: {
    clientOptions?: Partial<ClientOptions>;
  }): Promise<Client> {
    const _clientOptions = clientOptions || {};

    if (!clientOptions?.url) {
      _clientOptions.url = url;
    }

    const wsClient = createWSClient({
      url: url.replace("http", "ws").replace("https", "wss"),
      connectionParams: async () => {
        return {
          headers: {
            "x-hasura-admin-secret": secret,
          },
        };
      },
      lazy: true,
    });

    _clientOptions.exchanges = [
      fetchExchange,
      subscriptionExchange({
        forwardSubscription(request) {
          const input = { ...request, query: request.query || "" };
          return {
            subscribe(sink) {
              const dispose = wsClient.subscribe(input, sink);
              return { unsubscribe: dispose };
            },
          };
        },
      }),
      ...(_clientOptions.exchanges || []),
    ];

    return createClient({
      ..._clientOptions,
      requestPolicy: _clientOptions.requestPolicy || "network_only",
      fetchOptions: {
        headers: {
          "x-hasura-admin-secret": secret,
        },
      },
    } as ClientOptions);
  }

  return { getClient };
};

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    uuid: string;
    bigint: number;
    smallint: number;

    jsonb: string;
    date: string;
    timestamptz: string;
    String: string;
    Guid: string;
    DateTime: string;
  };
}>();

export type { introspection };
export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";
export const { getClient: getSpectraClient } = initTadaClient({
  url: import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT,
  secret: import.meta.env.VITE_HASURA_ADMIN_SECRET,
});
