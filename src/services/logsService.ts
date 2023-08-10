import { trpcClient } from "src/infra/trpc";

export async function logsGetAllCredit(params: {
  page?: number;
  size?: number;
}) {
  try {
    const response = await trpcClient.logs.getCreditAll.query(params);

    const contentPromise = response.content.map(async (logsCredit) => {
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

    response.content = await Promise.all(contentPromise);

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

export async function logsApproveCredit(params: { logId: number }) {
  try {
    const response = await trpcClient.logs.approveCredit.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function logsRejectCredit(params: { logId: number }) {
  try {
    const response = await trpcClient.logs.rejectCredit.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
