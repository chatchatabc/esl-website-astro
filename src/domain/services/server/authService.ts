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
const wordArrayHeader = CryptoJS.enc.Utf8.parse(jwtHeader);
const base64Header = CryptoJS.enc.Base64url.stringify(wordArrayHeader);

export function authCreateHash(value: string) {
  return CryptoJS.HmacSHA256(value, secret);
}

export function authCreateToken(id: number) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days

  const jwtPayload = JSON.stringify({ exp, id });
  const wordArrayPayload = CryptoJS.enc.Utf8.parse(jwtPayload);
  const base64Payload = CryptoJS.enc.Base64url.stringify(wordArrayPayload);
  const signature = authCreateHash(`${base64Header}.${base64Payload}`);

  return `${base64Header}.${base64Payload}.${signature}`;
}

export function authValidateToken(token: string) {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) {
    return false;
  }

  const authSignature = authCreateHash(`${header}.${payload}`).toString();
  if (signature !== authSignature) {
    return false;
  }

  return true;
}

export function authGetTokenPayload(token: string) {
  if (token.startsWith("Bearer ")) {
    token = token.slice("bearer ".length);
  }

  if (!authValidateToken(token)) {
    return null;
  }

  const wordArrayPayload = CryptoJS.enc.Base64url.parse(token.split(".")[1]);
  const payload = wordArrayPayload.toString(CryptoJS.enc.Utf8);
  const data = JSON.parse(payload) as { id: number; exp: number };

  if (data.exp < Date.now() / 1000) {
    return null;
  }

  return data.id;
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
  } else if (user.password !== authCreateHash(body.password).toString()) {
    return utilFailedApiResponse("Invalid username or password", 401);
  }

  const token = authCreateToken(user.id);
  delete user.password;
  const response = utilSuccessApiResponse({ data: user }, 200);
  response.headers.append(
    "Set-Cookie",
    `token=${token}; path=/; max-age=604800; HttpOnly`
  );
  response.headers.append(
    "Set-Cookie",
    `id=${user.id}; path=/; max-age=604800`
  );

  return response;
}
