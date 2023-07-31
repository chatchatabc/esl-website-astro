import type { CommonParams } from "src/domain/models/CommonModel";
import {
  userDbGet,
  userDbGetAll,
  userDbGetTotal,
  userDbUpdate,
} from "src/domain/repositories/userRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";
import type {
  User,
  UserContactInformation,
  UserPersonalInformation,
} from "src/domain/models/UserModel";
import { messageSend } from "./messageService";
import { authGenerateRandomToken } from "./authService";

export async function userGetAll(params: CommonParams, bindings: Bindings) {
  const { page, size } = params;
  const query = await userDbGetAll(params, bindings);
  if (!query) {
    throw utilFailedResponse("Error", 404);
  }

  const total = await userDbGetTotal(bindings);
  if (total === null) {
    throw utilFailedResponse("Error", 404);
  }

  return {
    content: query.results as any as User[],
    total,
    page,
    size,
  };
}

export async function userGet(params: { userId: number }, bindings: Bindings) {
  const user = await userDbGet(params, bindings);
  if (!user) {
    throw utilFailedResponse("Error", 404);
  }

  return user;
}

export async function userUpdateProfile(
  params: UserPersonalInformation & UserContactInformation & { id?: number },
  bindings: Bindings
) {
  let user = await userDbGet({ userId: params.id ?? 0 }, bindings);
  if (!user) {
    throw utilFailedResponse("Error", 404);
  }

  user = { ...user, ...params };

  const query = await userDbUpdate(user, bindings);
  if (!query) {
    throw utilFailedResponse("Error", 500);
  }

  return query;
}

export async function userValidatePhoneToken(
  params: { token: string; userId: number },
  bindings: Bindings
) {
  const data = await bindings.KV.get(params.token);
  if (!data) {
    throw utilFailedResponse("Invalid token", 400);
  }

  const parsedData = JSON.parse(data);
  if (parsedData.type !== "phone") {
    throw utilFailedResponse("Invalid token", 400);
  } else if (parsedData.exp < new Date().getTime()) {
    throw utilFailedResponse("Expired token", 400);
  } else if (parsedData.userId !== params.userId) {
    throw utilFailedResponse("Invalid token", 400);
  }

  const user = await userDbGet({ userId: params.userId }, bindings);
  if (!user) {
    throw utilFailedResponse("Cannot find user", 404);
  }
  user.phoneVerifiedAt = new Date().getTime();

  const update = await userDbUpdate(user, bindings);
  if (!update) {
    throw utilFailedResponse("Error", 500);
  }

  await bindings.KV.delete(params.token);

  return true;
}

export async function userGetPhoneToken(
  params: { userId: number },
  bindings: Bindings
) {
  const user = await userDbGet(params, bindings);
  if (!user) {
    throw utilFailedResponse("Cannot find user", 404);
  }

  if (!user.phone) {
    throw utilFailedResponse("Cannot find phone number", 404);
  }

  const randomToken = authGenerateRandomToken();
  const data = {
    type: "phone",
    userId: user.id,
    exp: new Date().getTime() + 1000 * 60 * 5,
  };
  await bindings.KV.put(randomToken, JSON.stringify(data));

  const message = {
    to: user.phone,
    body: `Your verification code is ${randomToken}, only valid for 5 minutes.\n\nMessage from ChatChatABC.\n\n`,
  };

  const response = await messageSend(message, bindings);

  return response;
}
