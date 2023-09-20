import { trpcClient } from "src/infra/trpc";
import type { CommonPaginationInput } from "../../../esl-backend-workers/src/domain/models/CommonModel";

export async function courseGetAll(params: CommonPaginationInput) {
  try {
    const response = await trpcClient.course.getAll.query(params);

    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
