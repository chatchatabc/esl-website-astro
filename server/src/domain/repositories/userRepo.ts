import { Bindings } from "../..";
import { User } from "../models/UserModel";

export async function userDbGetByUsername(value: string, bindings: Bindings) {
  const results = (await bindings.DB.prepare(
    "SELECT * FROM users WHERE username = ?"
  )
    .bind(value)
    .first()) as User | null;

  return results;
}
