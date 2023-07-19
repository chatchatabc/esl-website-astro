import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import type { Bindings } from "src/server";
import { utilValidOrigin } from "src/services/utilService";

type Props = {
  req: Request;
  resHeaders: Headers;
  env: Bindings;
  ctx: ExecutionContext;
};

export function trpcContext({ resHeaders, req, ...props }: Props) {
  const origin = req.headers.get("Origin") ?? "";

  if (utilValidOrigin(origin)) {
    resHeaders.append("Access-Control-Allow-Origin", origin);
    resHeaders.append("Access-Control-Allow-Methods", "*");
    resHeaders.append(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    resHeaders.append("Access-Control-Allow-Credentials", "true");
  }

  return { ...props, resHeaders, req };
}

export type TrpcContext = inferAsyncReturnType<typeof trpcContext>;

export const trpc = initTRPC.context<TrpcContext>().create();
export const trpcRouterCreate = trpc.router;
export const trpcProcedure = trpc.procedure;
