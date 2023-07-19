import type {
  User,
  UserLogin,
  UserRegister,
} from "src/domain/models/UserModel";
import { trpcClient } from "src/domain/infra/trpcClientActions";
import { utilHandleTrpcError } from "./utilService";
import type { AxiosResponse } from "src/domain/models/AxiosModel";
import { restPost } from "src/domain/infra/restActions";

export async function authLogin(data: UserLogin) {
  const response: AxiosResponse<User> = await restPost("/auth/login", data);

  if (response.data.errors) {
    return response.data;
  }

  const token = response.headers["x-access-token"];
  if (!token) {
    return {
      errors: [
        {
          title: "Missing token",
          message: "Missing token",
        },
      ],
    };
  }
  document.cookie = `token=${token}; path=/; max-age=86400`;

  return response.data;
}

export async function authRegister(data: UserRegister) {
  try {
    const response = await trpcClient.auth.register.mutate(data);
    return response;
  } catch (e) {
    return utilHandleTrpcError(e);
  }
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
