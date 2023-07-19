import type { inferAsyncReturnType } from "@trpc/server";
import type { Bindings } from "src/server";

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
  const origin = req.headers.get("Origin") ?? "https://esl-cca.pages.dev";

  if (allowedOrigins.includes(origin)) {
    resHeaders.append("Access-Control-Allow-Origin", origin);
  }
  resHeaders.append("Access-Control-Allow-Methods", "*");
  resHeaders.append(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  resHeaders.append("Access-Control-Allow-Credentials", "true");

  return { ...props, resHeaders, req };
}

export type TrpcContext = inferAsyncReturnType<typeof trpcContext>;
