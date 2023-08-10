import { trpcClient } from "src/infra/trpc";

export async function userGet(params: { userId: number }) {
  try {
    const response = await trpcClient.user.get.query(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
