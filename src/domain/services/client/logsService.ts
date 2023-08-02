import { trpcClient } from "src/domain/infra/trpcClientActions";

export async function logsGetAllCredit() {
  try {
    const response = await trpcClient.logs.getCreditAll.query({
      page: 0,
      size: 10,
    });

    const contentPromise = response.map(async (logsCredit) => {
      const sender = await trpcClient.user.get.query({
        userId: logsCredit.senderId,
      });
      if (sender) {
        logsCredit.sender = sender;
      }

      const receiver = await trpcClient.user.get.query({
        userId: logsCredit.receiverId,
      });
      if (receiver) {
        logsCredit.receiver = receiver;
      }

      return logsCredit;
    });

    const content = await Promise.all(contentPromise);

    return content;
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
