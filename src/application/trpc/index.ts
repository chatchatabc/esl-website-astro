import { initTRPC } from "@trpc/server";
import type { UserLogin, UserRegister } from "../../domain/models/UserModel";
import { authLogin, authRegister } from "../../domain/services/authService";
import { utilFailedResponse } from "../../domain/services/utilService";
import type { TrpcContext } from "./context";

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
  register: trpc.procedure
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
