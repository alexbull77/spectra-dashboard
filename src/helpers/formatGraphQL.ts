import prettier from "prettier/standalone";
import parserGraphql from "prettier/plugins/graphql";

export function formatGraphQL(query: string): Promise<string> {
  try {
    return prettier.format(query, {
      parser: "graphql",
      plugins: [parserGraphql],
    });
  } catch (e) {
    console.error("Failed to format GraphQL:", e);
    return Promise.resolve(query);
  }
}
