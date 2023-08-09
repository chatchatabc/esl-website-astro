import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { trpcRouter } from "./application/trpc";
import rest from "./application/rest";
import { trpcContext } from "./domain/infra/trpcServerActions";
import {
  cronRemindClass,
  cronValidateClass,
} from "./domain/services/server/cronService";

export type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
};

export default {
  async fetch(
    request: Request,
    env: Bindings,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Validate origin
    const origin = request.headers.get("Origin") ?? "";
    // if (!utilValidOrigin(origin)) {
    //   return new Response("Invalid origin", { status: 403 });
    // }

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": "true",
        },
        status: 204,
      });
    }

    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/trpc")) {
      return fetchRequestHandler({
        endpoint: "/trpc",
        req: request,
        router: trpcRouter,
        createContext: (e) => trpcContext({ ...e, env, ctx }),
      });
    } else if (pathname.startsWith("/api")) {
      return rest(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    if (event.cron === "20,50 * * * *") {
      ctx.waitUntil(cronRemindClass(env));
    } else if (event.cron === "*/30 * * * *") {
      ctx.waitUntil(cronValidateClass(env));
    }
  },
};
