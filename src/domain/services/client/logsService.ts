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

export async function logsRequestCredit(params: { amount: number }) {
  try {
    const response = await trpcClient.logs.requestCredit.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
