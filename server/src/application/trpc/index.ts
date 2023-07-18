import { initTRPC } from "@trpc/server";
import { TrpcContext } from "./context";
import { UserLogin } from "../../domain/models/UserModel";
import { authLogin } from "../../domain/services/authService";

export const trpc = initTRPC.context<TrpcContext>().create();

/**
 * Due to some bugs, we cannot import
 * this router from another file
 */
const authRouter = trpc.router({
  login: trpc.procedure
    .input((input) => {
      const data = input as UserLogin;
      if (!data.username || !data.password) {
        throw new Error("Missing input fields");
      }
      return data;
    })
    .query(async (opts) => {
      return await authLogin(opts.input, opts.ctx);
    }),
});

export const trpcRouter = trpc.router({
  auth: authRouter,
  hello: trpc.procedure
    .input((values) => {
      return values;
    })
    .query(() => {
      return "Hello World!";
    }),
});

export type TrpcRouter = typeof trpcRouter;
