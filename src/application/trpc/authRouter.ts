import {
  trpc,
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { UserLogin, UserRegisterInput } from "src/domain/models/UserModel";
import {
  authCreateToken,
  authGetPhoneToken,
  authLogin,
  authRegister,
  authValidatePhoneToken,
} from "src/domain/services/server/authService";
import { utilFailedResponse } from "src/domain/services/server/utilService";

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

  register: trpc.procedure
    .input((values: any = {}) => {
      if (!values.username || !values.password || !values.confirmPassword) {
        throw utilFailedResponse("Missing fields for register", 400);
      }

      return {
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
      } as UserRegisterInput;
    })
    .mutation(async (opts) => {
      const user = await authRegister(opts.input, opts.ctx.env);
      if (!user) {
        throw utilFailedResponse("Failed to register user", 400);
      }

      const token = authCreateToken(user.id);
      opts.ctx.resHeaders.append(
        "Set-Cookie",
        `token=${token}; Path=/; SameSite=None; Secure; HttpOnly`
      );

      return user;
    }),

  getPhoneToken: trpcProcedure.query((opts) => {
    const { userId = 0, env } = opts.ctx;
    return authGetPhoneToken({ userId }, env);
  }),

  validatePhoneToken: trpcProcedure
    .input((values: any = {}) => {
      if (!values.token) {
        throw utilFailedResponse("Missing token", 400);
      }
      return values as { token: string };
    })
    .mutation((opts) => {
      const { userId = 0, env } = opts.ctx;
      const { token } = opts.input;
      return authValidatePhoneToken({ userId, token }, opts.ctx.env);
    }),
});
