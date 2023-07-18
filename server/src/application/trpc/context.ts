import { inferAsyncReturnType } from "@trpc/server";
import { Bindings } from "../..";

type Props = {
  req: Request;
  resHeaders: Headers;
  env: Bindings;
  ctx: ExecutionContext;
};

export function trpcContext({ resHeaders, req, ...props }: Props) {
  resHeaders.append("Access-Control-Allow-Origin", "*");
  resHeaders.append("Access-Control-Allow-Methods", "*");
  resHeaders.append(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  resHeaders.append("Access-Control-Expose-Headers", "x-access-token");

  return { ...props, resHeaders, req };
}

export type TrpcContext = inferAsyncReturnType<typeof trpcContext>;
