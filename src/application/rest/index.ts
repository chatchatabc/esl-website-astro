import type { Bindings } from "src/server";
import authController from "./authController";

export default async (
  request: Request,
  env: Bindings,
  ctx: ExecutionContext
): Promise<Response> => {
  let { pathname } = new URL(request.url);
  pathname = pathname.slice("/api".length);

  if (pathname.startsWith("/auth")) {
    return authController(request, env, ctx);
  }

  return new Response("Not found", { status: 404 });
};
