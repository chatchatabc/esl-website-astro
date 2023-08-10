import { trpcClient } from "src/infra/trpc";

export async function teacherGet(params: { userId: number }) {
  try {
    const response = await trpcClient.teacher.get.query(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
