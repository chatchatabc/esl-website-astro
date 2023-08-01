import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import type { Bindings } from "src/server";
import {
  utilFailedResponse,
  utilValidOrigin,
} from "../services/server/utilService";
import { authGetTokenPayload } from "../services/server/authService";

type Props = {
  req: Request;
  resHeaders: Headers;
  env: Bindings;
  ctx: ExecutionContext;
};

export function trpcContext({ resHeaders, req, ...props }: Props) {
  const origin = req.headers.get("Origin") ?? "";

  // Get token from cookie
  const setCookieHeader = req.headers.get("Cookie");
  const tokenCookie = setCookieHeader
    ?.split(";")
    .find((c) => c.includes("token="));
  const token = tokenCookie?.split("=")[1] ?? "";

  const userId = authGetTokenPayload(token);

  // Set CORS headers
  if (utilValidOrigin(origin)) {
    resHeaders.append("Access-Control-Allow-Origin", origin);
    resHeaders.append("Access-Control-Allow-Methods", "*");
    resHeaders.append("Access-Control-Allow-Headers", "Content-Type");
    resHeaders.append("Access-Control-Allow-Credentials", "true");
  }

  return { ...props, resHeaders, req, userId };
}

export type TrpcContext = inferAsyncReturnType<typeof trpcContext>;

export const trpc = initTRPC.context<TrpcContext>().create();
export const trpcRouterCreate = trpc.router;
export const trpcProcedure = trpc.procedure.use(
  trpc.middleware((opts) => {
    if (!opts.ctx.userId) {
      throw utilFailedResponse("Invalid Token", 403);
    }
    return opts.next(opts);
  })
);
export const trpcProcedureAdmin = trpc.procedure.use(
  trpc.middleware((opts) => {
    if (opts.ctx.userId !== 1) {
      throw utilFailedResponse("Forbidden Access", 403);
    }
    return opts.next(opts);
  })
);
