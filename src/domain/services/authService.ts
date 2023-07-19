import { userDbGetByUsername, userDbInsert } from "../repositories/userRepo";
import CryptoJS, { SHA256 } from "crypto-js";
import { utilFailedResponse } from "./utilService";
import type { User, UserLogin, UserRegister } from "../models/UserModel";
import type { TrpcContext } from "src/application/trpc/context";
import type { TrpcResponse } from "../models/TrpcModel";

const secret = "secret";

export function authCreateHash(password: string) {
  return SHA256(password + secret).toString();
}

export function authCreateToken(payload: Record<string, any>) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days

  const data = {
    iat,
    exp,
    payload,
  };

  return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
}

export function authDecodeToken(token: string) {
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  const bytes = CryptoJS.AES.decrypt(token, secret);
  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as {
    iat: number;
    exp: number;
    payload: Record<string, any>;
  };

  if (data.exp < Math.floor(Date.now() / 1000)) {
    throw utilFailedResponse("Token expired", 401);
  }

  return data.payload;
}

export async function authRegister(input: UserRegister, ctx: TrpcContext) {
  let user = await userDbGetByUsername(input.username, ctx.env);
  if (user) {
    throw utilFailedResponse("User already exists", 400);
  }

  user = await userDbInsert(input, ctx.env);
  if (!user) {
    throw utilFailedResponse("Failed to create user", 500);
  }

  delete user.password;
  return {
    data: user,
  } as TrpcResponse<User>;
}

export async function authLogin(input: UserLogin, ctx: TrpcContext) {
  const user = await userDbGetByUsername(input.username, ctx.env);

  if (!user) {
    throw utilFailedResponse("User not found", 404);
  } else if (user.password !== authCreateHash(input.password)) {
    throw utilFailedResponse("Wrong password", 401);
  }

  // create token
  const token = authCreateToken({
    id: user.id,
  });

  ctx.resHeaders.append(
    "Set-Cookie",
    `token=${token}; Path=/; secure; HttpOnly`
  );
  ctx.resHeaders.append(
    "Set-Cookie",
    `role=${user.role}; Path=/; secure; HttpOnly`
  );
  ctx.resHeaders.append("Set-Cookie", `id=${user.id}; Path=/; secure`);

  delete user.password;
  return {
    data: user,
  } as TrpcResponse<User>;
}
