import type { UserLogin, UserRegisterInput } from "src/domain/models/UserModel";
import { trpcClient } from "src/domain/infra/trpcClientActions";

export async function authLogin(data: UserLogin) {
  try {
    const user = await trpcClient.auth.login.mutate(data);
    if (user) {
      document.cookie = `userId=${user.id}; path=/; max-age=31536000`;
    }
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
      document.cookie = `userId=; path=/; max-age=0`;
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    document.cookie = `userId=; path=/; max-age=0`;
    return null;
  }
}

export async function authRegister(data: UserRegisterInput) {
  try {
    const response = await trpcClient.auth.register.mutate(data);
    if (response) {
      document.cookie = `userId=${response.id}; path=/; max-age=31536000`;
    }
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function authGetUserId() {
  const cookie = document.cookie;
  const userId = cookie
    .split("; ")
    .find((item) => item.includes("userId="))
    ?.split("=")[1];

  if (!userId) {
    return undefined;
  }

  return Number(userId);
}
