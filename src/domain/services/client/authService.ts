import type {
  User,
  UserLogin,
  UserRegister,
} from "src/domain/models/UserModel";
import type { AxiosResponse } from "src/domain/models/AxiosModel";
import { restPost } from "src/domain/infra/restActions";
import { trpcClient } from "src/domain/infra/trpcClientActions";

export async function authLogin(data: UserLogin) {
  try {
    const user = await trpcClient.auth.login.mutate(data);
    sessionStorage.setItem("userId", user.id.toString());
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function authLogout() {
  sessionStorage.removeItem("userId");
  return true;
}

export async function authRegister(data: UserRegister) {
  const response: AxiosResponse<User> = await restPost("/auth/register", data);

  return response.data;
}

export function authGetUserId() {
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    return null;
  }

  return userId.split("=")[1];
}
