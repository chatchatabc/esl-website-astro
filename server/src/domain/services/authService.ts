import { TrpcContext } from "../../application/trpc/context";
import { UserLogin } from "../models/UserModel";
import { userDbGetByUsername } from "../repositories/userRepo";
import { SHA256 } from "crypto-js";
import { utilFailedResponse } from "./utilService";

const secret = "secret";

export function authCreateHash(password: string) {
  return SHA256(password + secret).toString();
}

export async function authLogin(input: UserLogin, ctx: TrpcContext) {
  const user = await userDbGetByUsername(input.username, ctx.env);

  if (!user) {
    throw utilFailedResponse("User not found", 404);
  } else if (user.password !== authCreateHash(input.password)) {
    throw utilFailedResponse("Wrong password", 401);
  }

  delete user.password;
  return user;
}
