import { userDbGetByUsername, userDbInsert } from "../../repositories/userRepo";
import CryptoJS from "crypto-js";
import { utilFailedResponse } from "../server/utilService";
import type { User, UserRegister } from "../../models/UserModel";
import type { TrpcResponse } from "../../models/TrpcModel";
import type { TrpcContext } from "../../infra/trpcServerActions";

const secret = "I)0Don't!1Care@2";
const jwtHeader = JSON.stringify({ alg: "HS256", typ: "JWT" });
const base64Header = Buffer.from(jwtHeader).toString("base64");

export function authCreateHash(value: string) {
  return CryptoJS.HmacSHA256(value, secret).toString();
}

export function authCreateToken(id: number) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days

  const jwtPayload = JSON.stringify({ exp, id });
  const base64Payload = Buffer.from(jwtPayload).toString("base64");
  const signature = authCreateHash(`${base64Header}.${base64Payload}`);

  return `${base64Header}.${base64Payload}.${signature}`;
}

export function authValidateToken(token: string) {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) {
    return false;
  }

  const authSignature = authCreateHash(`${header}.${payload}`);
  if (signature !== authSignature) {
    return false;
  }

  return true;
}

export function authGetTokenPayload(token: string) {
  if (token.startsWith("Bearer ")) {
    token.slice("bearer ".length);
  }

  if (!authValidateToken(token)) {
    return null;
  }

  const payload = token.split(".")[1];
  const data = Buffer.from(payload, "base64").toString();
  const obj = JSON.parse(data) as { id: number; exp: number };

  if (obj.exp < Date.now()) {
    return null;
  }

  return obj.id;
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
