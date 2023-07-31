import {
  trpc,
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { UserLogin } from "src/domain/models/UserModel";
import {
  authCreateToken,
  authLogin,
} from "src/domain/services/server/authService";

export default trpcRouterCreate({
  login: trpc.procedure
    .input((values) => {
      const data = values as UserLogin;
      if (!data.username || !data.password) {
        throw new Error("Missing username or password");
      }
      return data;
    })
    .mutation(async (opts) => {
      const user = await authLogin(opts.input, opts.ctx.env);
      const token = authCreateToken(user.id);
      opts.ctx.resHeaders.append(
        "Set-Cookie",
        `token=${token}; Path=/; SameSite=None; Secure; HttpOnly`
      );
      return user;
    }),

  logout: trpcProcedure.query((opts) => {
    opts.ctx.resHeaders.append(
      "Set-Cookie",
      `token=; Path=/; SameSite=None; Secure; HttpOnly; Max-Age=0`
    );
    return true;
  }),
});
