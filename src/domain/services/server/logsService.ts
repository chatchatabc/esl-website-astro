import { logsDbGetAllCredit } from "src/domain/repositories/logsRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";

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
