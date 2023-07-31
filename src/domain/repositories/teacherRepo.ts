import type { Bindings } from "src/server";
import type { Teacher } from "../models/TeacherModel";

export async function teacherDbGet(
  params: { userId: number },
  bindings: Bindings
) {
  const { userId } = params;

  try {
    const user = await bindings.DB.prepare(
      "SELECT * FROM teachers WHERE userId = ?"
    )
      .bind(userId)
      .first<Teacher>();

    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}
