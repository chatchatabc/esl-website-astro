import { trpcClient } from "src/infra/trpc";
import type {
  UserLogin,
  UserRegisterInput,
} from "../../../esl-workers/src/domain/models/UserModel";

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
    const response = await trpcClient.auth.logout.mutate();
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

export async function authGetPhoneToken() {
  try {
    const response = await trpcClient.auth.getPhoneToken.query();
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function authValidatePhoneToken(params: { token: string }) {
  try {
    const response = await trpcClient.auth.validatePhoneToken.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function authGetProfile() {
  try {
    const response = await trpcClient.auth.getProfile.query();
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function authUpdateProfile(params: Record<string, any>) {
  const data = {
    firstName: params.firstName,
    lastName: params.lastName,
    phone: params.phone,
  };

  try {
    const response = await trpcClient.auth.updateProfile.mutate(data);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
