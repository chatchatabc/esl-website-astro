import { trpcClient } from "src/domain/infra/trpcClientActions";

export async function teacherGet(params: { userId: number }) {
  try {
    const response = await trpcClient.teacher.get.query(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
