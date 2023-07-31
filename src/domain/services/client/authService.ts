import type {
  User,
  UserLogin,
  UserRegister,
} from "src/domain/models/UserModel";
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

export async function authLogout() {
  try {
    const response = await trpcClient.auth.logout.query();
    if (response) {
      sessionStorage.removeItem("userId");
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function authRegister(data: UserRegister) {
  // const response: AxiosResponse<User> = await restPost("/auth/register", data);

  // return response.data;
  return null;
}

export function authGetUserId() {
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    return null;
  }

  return Number(userId);
}
