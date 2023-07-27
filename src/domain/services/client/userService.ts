import { trpcClient } from "src/domain/infra/trpcClientActions";

export async function userGet(params: { userId: number }) {
  try {
    const response = await trpcClient.user.get.query(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function userGetProfile() {
  try {
    const response = await trpcClient.user.profile.query();
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
