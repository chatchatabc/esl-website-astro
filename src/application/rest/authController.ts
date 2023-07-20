import type { UserLogin, UserRegister } from "src/domain/models/UserModel";
import {
  authLogin,
  authRegister,
} from "src/domain/services/server/authService";
import { utilFailedApiResponse } from "src/domain/services/server/utilService";
import type { Bindings } from "src/server";

export default async (
  request: Request,
  env: Bindings,
  ctx: ExecutionContext
): Promise<Response> => {
  let { pathname } = new URL(request.url);
  pathname = pathname.slice("/api/auth".length);

  // PATH: /api/auth/login
  if (pathname.startsWith("/login")) {
    const body = (await request.json()) as UserLogin;
    if (!body.username || !body.password) {
      return utilFailedApiResponse("Missing username or password", 400);
    }

    return authLogin(body, env);
  }

  // PATH: /api/auth/register
  else if (pathname.startsWith("/register")) {
    const body = (await request.json()) as UserRegister;

    if (
      !body.username ||
      !body.password ||
      !body.confirmPassword ||
      !body.role
    ) {
      return utilFailedApiResponse("Missing username or password", 400);
    } else if (body.password !== body.confirmPassword) {
      return utilFailedApiResponse(
        "Password and Confirm password are not the same",
        400
      );
    }

    return authRegister(body, env);
  }

  return new Response("Not found", { status: 404 });
};
