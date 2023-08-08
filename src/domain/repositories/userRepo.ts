import type { Bindings } from "src/server";
import { authCreateHash } from "../services/server/authService";
import type { User, UserRegister } from "../models/UserModel";
import type { CommonParams } from "../models/CommonModel";

export async function userDbUpdate(params: User, bindings: Bindings) {
  const {
    id = null,
    username = null,
    password = null,
    roleId = null,
    firstName = null,
    lastName = null,
    phone = null,
    email = null,
    phoneVerifiedAt = null,
    emailVerifiedAt = null,
  } = params;

  const date = new Date().getTime();
  try {
    const query = await bindings.DB.prepare(
      "UPDATE users SET username = ?, password = ?, roleId = ?, updatedAt = ?, firstName = ?, lastName = ?, phone = ?, email = ?, phoneVerifiedAt = ?, emailVerifiedAt = ? WHERE id = ?"
    )
      .bind(
        username,
        password,
        roleId,
        date,
        firstName,
        lastName,
        phone,
        email,
        phoneVerifiedAt,
        emailVerifiedAt,
        id
      )
      .run();

    return query;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userDbGet(
  params: { userId: number },
  bindings: Bindings
) {
  const { userId } = params;

  try {
    const user = await bindings.DB.prepare("SELECT * FROM users WHERE id = ?")
      .bind(userId)
      .first<User>();

    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userDbGetAll(params: CommonParams, bindings: Bindings) {
  const { size } = params;

  try {
    const results = await bindings.DB.prepare("SELECT * FROM users LIMIT ?")
      .bind(size)
      .all<User>();

    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userDbGetTotal(bindings: Bindings) {
  try {
    const stmt = bindings.DB.prepare("SELECT COUNT(*) AS total FROM users");
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userDbGetByUsername(value: string, bindings: Bindings) {
  const results = (await bindings.DB.prepare(
    "SELECT * FROM users WHERE username = ?"
  )
    .bind(value)
    .first()) as User | null;

  return results;
}

export async function userDbInsert(body: UserRegister, bindings: Bindings) {
  const { username, password, roleId } = body;
  const date = new Date();
  try {
    await bindings.DB.prepare(
      "INSERT INTO users (username, password, createdAt, updatedAt, roleId, credit) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(username, password, date.getTime(), date.getTime(), roleId, 0)
      .run();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
