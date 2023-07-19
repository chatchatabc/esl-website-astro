import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { trpcContext } from "./application/trpc/context";
import { trpcRouter } from "./application/trpc";
import { utilValidOrigin } from "./services/utilService";

export type Bindings = {
  DB: D1Database;
};

export default {
  async fetch(
    request: Request,
    env: Bindings,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      const origin = request.headers.get("Origin") ?? "";
      if (utilValidOrigin(origin)) {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
          },
          status: 204,
        });
      }
    }

    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/trpc")) {
      return fetchRequestHandler({
        endpoint: "/trpc",
        req: request,
        router: trpcRouter,
        createContext: (e) => trpcContext({ ...e, env, ctx }),
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
