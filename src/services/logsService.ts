import { trpcClient } from "src/infra/trpc";

export async function logsGetAllCredit(params: {
  page?: number;
  size?: number;
}) {
  try {
    const response = await trpcClient.logs.getCreditAll.query(params);

    const contentPromise = response.content.map(async (logsCredit) => {
      const user = await trpcClient.user.get.query({
        userId: logsCredit.userId,
      });
      if (user) {
        logsCredit.user = user;
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

// export async function logsRequestCredit(params: { amount: number }) {
//   try {
//     const response = await trpcClient.logs.requestCredit.mutate(params);
//     return response;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// }

// export async function logsApproveCredit(params: { logId: number }) {
//   try {
//     const response = await trpcClient.logs.approveCredit.mutate(params);
//     return response;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// }

// export async function logsRejectCredit(params: { logId: number }) {
//   try {
//     const response = await trpcClient.logs.rejectCredit.mutate(params);
//     return response;
//   } catch (e) {
//     console.log(e);
//     return null;
//   }
// }
