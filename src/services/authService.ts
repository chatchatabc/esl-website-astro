import trpc, { trpcAction } from "src/infra/trpc";
import type {
  User,
  UserLogin,
  UserRegister,
} from "../../../server/src/domain/models/UserModel";

export async function authLogin(data: UserLogin) {
  const response = await trpcAction<User>(trpc.auth.login.query, data);

  return response;
}

export async function authRegister(data: UserRegister) {
  const response = await trpcAction<User>(trpc.auth.register.mutate, data);

  return response;
}
