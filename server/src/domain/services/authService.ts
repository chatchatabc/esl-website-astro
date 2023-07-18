import { TrpcContext } from "../../application/trpc/context";
import { UserLogin } from "../models/UserModel";
import { userDbGetByUsername } from "../repositories/userRepo";
import { SHA256 } from "crypto-js";

const secret = "secret";

export function authCreateHash(password: string) {
  return SHA256(password + secret).toString();
}

export async function authLogin(input: UserLogin, ctx: TrpcContext) {
  const user = await userDbGetByUsername(input.username, ctx.env);

  if (!user) {
    throw new Error("User not found");
  } else if (user.password !== authCreateHash(input.password)) {
    throw new Error("Invalid password");
  }

  delete user.password;
  return user;
}
