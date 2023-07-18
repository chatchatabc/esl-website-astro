import trpc, { trpcAction } from "src/infra/trpc";
import type {
  User,
  UserLogin,
} from "../../../server/src/domain/models/UserModel";

export async function authLogin(input: UserLogin) {
  const response = await trpcAction<User>(trpc.auth.login.query, input);

  return response;
}
