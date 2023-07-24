import type {
  User,
  UserLogin,
  UserRegister,
} from "src/domain/models/UserModel";
import type { AxiosResponse } from "src/domain/models/AxiosModel";
import { restPost } from "src/domain/infra/restActions";

export async function authLogin(data: UserLogin) {
  const response: AxiosResponse<User> = await restPost("/auth/login", data);

  if (response.data.errors) {
    return response.data;
  }

  // console.log(document.cookie);
  // const setCookieHeader = response.headers["set-cookie"];
  // console.log(setCookieHeader);
  // if (!setCookieHeader) {
  //   return {
  //     errors: [
  //       {
  //         title: "Missing cookie",
  //         message: "Missing cookie",
  //       },
  //     ],
  //   };
  // }

  return response.data;
}

export function authLogout() {
  document.cookie = `token=; path=/; max-age=0`;
  return true;
}

export async function authRegister(data: UserRegister) {
  const response: AxiosResponse<User> = await restPost("/auth/register", data);

  return response.data;
}

export function authGetToken() {
  const token = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("token="));

  if (!token) {
    return null;
  }

  return token.split("=")[1];
}

export function authGetUserId() {
  console.log(document.cookie);
  const userId = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("id="));

  if (!userId) {
    return null;
  }

  return userId.split("=")[1];
}
