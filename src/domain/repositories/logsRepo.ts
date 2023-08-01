import type { Bindings } from "src/server";
import type { LogsCredit } from "../models/LogsModel";

export async function logsDbGetAllCredit(
  params: { userId: number },
  bindings: Bindings
) {
  const { userId } = params;
  try {
    const results = await bindings.DB.prepare(
      "SELECT * FROM logsCredit WHERE senderId = ? OR receiverId = ?"
    )
      .bind(userId, userId)
      .all<LogsCredit>();

    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}
