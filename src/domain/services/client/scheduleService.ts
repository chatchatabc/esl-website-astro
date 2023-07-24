import { trpcClient } from "src/domain/infra/trpcClientActions";

export async function scheduleGetAllByUser(params: { userId: number }) {
  try {
    const response = await trpcClient.schedule.getAllByUser.query(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
