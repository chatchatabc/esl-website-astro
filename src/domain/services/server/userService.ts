import type { CommonParams } from "src/domain/models/CommonModel";
import {
  userDbGet,
  userDbGetAll,
  userDbGetTotal,
} from "src/domain/repositories/userRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";
import type { User } from "src/domain/models/UserModel";

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
