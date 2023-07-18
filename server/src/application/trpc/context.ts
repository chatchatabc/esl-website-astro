import { inferAsyncReturnType } from "@trpc/server";
import { Bindings } from "../..";

type Props = {
  req: Request;
  resHeaders: Headers;
  env: Bindings;
  ctx: ExecutionContext;
};

export function trpcContext({ resHeaders, req, ...props }: Props) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://esl-cca.pages.dev",
    "https://trpc.esl-cca.pages.dev",
  ];
  const origin = req.headers.get("Origin") ?? "";

  if (allowedOrigins.includes(origin)) {
    resHeaders.append("Access-Control-Allow-Origin", origin);
  }
  resHeaders.append("Access-Control-Allow-Methods", "*");
  resHeaders.append(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  resHeaders.append("Access-Control-Expose-Headers", "x-access-token");

  return { ...props, resHeaders, req };
}

export type TrpcContext = inferAsyncReturnType<typeof trpcContext>;
