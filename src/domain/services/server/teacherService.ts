import { teacherDbGet } from "src/domain/repositories/teacherRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";

export async function teacherGet(
  params: { userId: number },
  bindings: Bindings
) {
  const teacher = await teacherDbGet(params, bindings);
  if (!teacher) {
    throw utilFailedResponse("Cannot get teacher");
  }

  return teacher;
}
