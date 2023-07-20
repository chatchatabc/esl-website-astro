import type { CommonParams } from "src/domain/models/CommonModel";
import { userDbGet, userDbGetTotal } from "src/domain/repositories/userRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";
import type { User } from "src/domain/models/UserModel";

export async function userGet(params: CommonParams, bindings: Bindings) {
  const { page, size } = params;
  const query = await userDbGet(params, bindings);
  const total = await userDbGetTotal(bindings);

  if (!query || !total) {
    throw utilFailedResponse("Error", 404);
  }

  return {
    content: query.results as any as User[],
    total,
    page,
    size,
  };
}
