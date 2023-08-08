import { userDbGetByUsername, userDbInsert } from "../../repositories/userRepo";
import CryptoJS from "crypto-js";
import {
  utilFailedApiResponse,
  utilFailedResponse,
} from "../server/utilService";
import type { UserLogin, UserRegisterInput } from "../../models/UserModel";
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
    return undefined;
  }

  const wordArrayPayload = CryptoJS.enc.Base64url.parse(token.split(".")[1]);
  const payload = wordArrayPayload.toString(CryptoJS.enc.Utf8);
  const data = JSON.parse(payload) as { id: number; exp: number };

  if (data.exp < Date.now() / 1000) {
    return undefined;
  }

  return data.id;
}

export async function authRegister(input: UserRegisterInput, env: Bindings) {
  let user = await userDbGetByUsername(input.username, env);
  if (user) {
    throw utilFailedApiResponse("User already exists", 400);
  }

  const password = authCreateHash(input.password).toString();

  // Insert user with role of 2 (student)
  const query = await userDbInsert({ ...input, roleId: 2, password }, env);
  if (!query) {
    throw utilFailedApiResponse("Failed to create user", 500);
  }

  user = await userDbGetByUsername(input.username, env);
  return user;
}

export async function authLogin(body: UserLogin, env: Bindings) {
  let user = await userDbGetByUsername(body.username, env);
  if (!user) {
    throw utilFailedResponse("Invalid username or password", 401);
  } else if (user.password !== authCreateHash(body.password).toString()) {
    throw utilFailedResponse("Invalid username or password", 401);
  }

  delete user.password;
  return user;
}

export function authGenerateRandomToken(length = 6) {
  const characters = "0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
}
