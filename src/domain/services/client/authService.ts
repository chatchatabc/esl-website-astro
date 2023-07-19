import type { UserLogin, UserRegister } from "src/domain/models/UserModel";
import axios from "axios";
import { trpcClient } from "src/domain/infra/trpcClientActions";
import { utilHandleTrpcError } from "./utilService";

export async function authLogin(data: UserLogin) {
  try {
    const response = await axios.post("/api/auth/login", data);
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

export async function authGetToken() {
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
