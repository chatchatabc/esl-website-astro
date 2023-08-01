import {
  logsDbApproveCredit,
  logsDbGetAllCredit,
  logsDbGetCredit,
} from "src/domain/repositories/logsRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";
import { userGet } from "./userService";

export async function logsGetAllCredit(
  params: { userId: number },
  bindings: Bindings
) {
  const logs = await logsDbGetAllCredit(params, bindings);
  if (!logs) {
    throw utilFailedResponse("Failed to get logs", 500);
  }

  return logs.results;
}

export async function logsApproveCredit(
  params: { logId: number },
  bindings: Bindings
) {
  const logsCredit = await logsDbGetCredit(params, bindings);
  if (!logsCredit) {
    throw utilFailedResponse("Cannot get the log credit.", 500);
  }

  const sender = await userGet({ userId: logsCredit.senderId ?? 0 }, bindings);
  if (!sender) {
    throw utilFailedResponse("Cannot get sender", 500);
  }

  const receiver = await userGet(
    { userId: logsCredit.receiverId ?? 0 },
    bindings
  );
  if (!receiver) {
    throw utilFailedResponse("Cannot get receiver", 500);
  }

  logsCredit.status = 1;
  sender.credit -= logsCredit.amount;
  receiver.credit += logsCredit.amount;

  const success = await logsDbApproveCredit(
    logsCredit,
    sender,
    receiver,
    bindings
  );

  if (!success) {
    throw utilFailedResponse("Cannot approve credit log", 500);
  }

  return true;
}
