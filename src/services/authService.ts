import type { UserLogin, UserRegister } from "src/domain/models/UserModel";
import { utilHandleTrpcError } from "./utilService";
import { trpcClient } from "src/application/trpc/client";

export async function authLogin(data: UserLogin) {
  try {
    const response = await trpcClient.auth.login.mutate(data);
    return response;
  } catch (e) {
    return utilHandleTrpcError(e);
  }
}

export async function authRegister(data: UserRegister) {
  try {
    const response = await trpcClient.auth.register.mutate(data);
    return response;
  } catch (e) {
    return utilHandleTrpcError(e);
  }
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
