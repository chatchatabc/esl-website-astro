import { Bindings } from "../..";
import { User, UserRegister } from "../models/UserModel";
import { authCreateHash } from "../services/authService";

export async function userDbGetByUsername(value: string, bindings: Bindings) {
  const results = (await bindings.DB.prepare(
    "SELECT * FROM users WHERE username = ?"
  )
    .bind(value)
    .first()) as User | null;

  return results;
}

export async function userDbInsert(body: UserRegister, bindings: Bindings) {
  const { username, password, role } = body;
  const date = new Date();

  try {
    await bindings.DB.prepare(
      "INSERT INTO users (username, password, createdAt, updatedAt, role) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(
        username,
        authCreateHash(password),
        date.toISOString(),
        date.toISOString(),
        role
      )
      .run();

    return await userDbGetByUsername(username, bindings);
  } catch (e) {
    console.log(e);
    return null;
  }
}
