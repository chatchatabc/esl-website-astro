import { userDbGetByUsername, userDbInsert } from "../../repositories/userRepo";
import CryptoJS from "crypto-js";
import {
  utilFailedApiResponse,
  utilSuccessApiResponse,
} from "../server/utilService";
import type { UserLogin, UserRegister } from "../../models/UserModel";
import type { Bindings } from "src/server";

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

export async function authRegister(input: UserRegister, env: Bindings) {
  let user = await userDbGetByUsername(input.username, env);
  if (user) {
    return utilFailedApiResponse("User already exists", 400);
  }

  user = await userDbInsert(input, env);
  if (!user) {
    return utilFailedApiResponse("Failed to create user", 500);
  }

  const token = authCreateToken(user.id);
  delete user.password;
  const response = utilSuccessApiResponse({ data: user }, 200);
  response.headers.append("x-access-token", token);
  response.headers.append("Access-Control-Expose-Headers", "x-access-token");
  return response;
}

export async function authLogin(body: UserLogin, env: Bindings) {
  let user = await userDbGetByUsername(body.username, env);
  if (!user) {
    return utilFailedApiResponse("Invalid username or password", 401);
  } else if (user.password !== authCreateHash(body.password)) {
    return utilFailedApiResponse("Invalid username or password", 401);
  }

  const token = authCreateToken(user.id);
  delete user.password;
  const response = utilSuccessApiResponse({ data: user }, 200);
  response.headers.append("x-access-token", token);
  response.headers.append("Access-Control-Expose-Headers", "x-access-token");
  return response;
}
