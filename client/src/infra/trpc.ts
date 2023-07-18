import {
  TRPCClientError,
  createTRPCProxyClient,
  httpBatchLink,
} from "@trpc/client";
import type { TrpcRouter } from "../../../server/src/application/trpc";

export default createTRPCProxyClient<TrpcRouter>({
  links: [
    httpBatchLink({
      // url: "http://localhost:8787/trpc",
      url: "https://esl-cca.pages.dev/trpc",
      async headers() {
        return {};
      },
    }),
  ],
});

export async function trpcAction<Data = any>(action: any, input: any) {
  try {
    const response: { data: Data; errors: null } = await action(input);

    return response;
  } catch (e) {
    if (e instanceof TRPCClientError) {
      return {
        errors: [
          {
            message: e.message,
            title: "Error",
          },
        ],
      };
    }

    return {
      errors: [
        {
          message: "Unknown error",
          title: "Error",
        },
      ],
    };
  }
}
