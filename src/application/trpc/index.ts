import { authRegister } from "src/domain/services/server/authService";
import type { UserRegister } from "../../domain/models/UserModel";
import { utilFailedResponse } from "../../domain/services/server/utilService";
import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";

/**
 * Due to some bugs, we cannot import
 * this router from another file
 */
const authRouter = trpcRouterCreate({
  register: trpcProcedure
    .input((input) => {
      const data = input as UserRegister;
      if (!data.username || !data.password || !data.confirmPassword) {
        throw utilFailedResponse("Missing input fields", 400);
      } else if (data.password !== data.confirmPassword) {
        throw utilFailedResponse("Passwords do not match", 400);
      }
      return data;
    })
    .mutation(async (opts) => {
      return await authRegister(opts.input, opts.ctx);
    }),
});

export const trpcRouter = trpcRouterCreate({
  auth: authRouter,
  hello: trpcProcedure
    .input((values) => {
      return values;
    })
    .query((opts) => {
      return "Hello World!";
    }),
});

export type TrpcRouter = typeof trpcRouter;
