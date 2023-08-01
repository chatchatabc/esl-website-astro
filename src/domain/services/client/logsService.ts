import { trpcClient } from "src/domain/infra/trpcClientActions";

export async function logsGetAllCredit() {
  try {
    const response = await trpcClient.logs.getCreditAll.query({
      page: 0,
      size: 10,
    });
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
