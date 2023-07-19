import type { UserLogin } from "src/domain/models/UserModel";
import { userDbGetByUsername } from "src/domain/repositories/userRepo";
import {
  authCreateHash,
  authCreateToken,
} from "src/domain/services/server/authService";
import {
  utilFailedApiResponse,
  utilSuccessApiResponse,
} from "src/domain/services/server/utilService";
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

    let user = await userDbGetByUsername(body.username, env);
    if (!user) {
      return utilFailedApiResponse("Invalid username or password", 401);
    } else if (user.password !== authCreateHash(body.password)) {
      return utilFailedApiResponse("Invalid username or password", 401);
    }

    const token = authCreateToken({ id: user.id });
    delete user.password;
    const response = utilSuccessApiResponse({ data: user }, 200);
    response.headers.append("x-access-token", token);
    response.headers.append("Access-Control-Expose-Headers", "x-access-token");
    return response;
  }

  // PATH: /api/auth/register
  else if (pathname.startsWith("/register")) {
  }

  return new Response("Not found", { status: 404 });
};
