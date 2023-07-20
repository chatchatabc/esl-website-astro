import type { Bindings } from "src/server";
import type { CommonParams } from "../models/CommonModel";
import type { Schedule } from "../models/ScheduleModel";

export async function scheduleDbGet(params: CommonParams, bindings: Bindings) {
  const { size } = params;

  try {
    const results = await bindings.DB.prepare("SELECT * FROM schedules LIMIT ?")
      .bind(size)
      .all<Schedule>();

    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbGetTotal(bindings: Bindings) {
  try {
    const stmt = bindings.DB.prepare("SELECT COUNT(*) AS total FROM schedules");
    const total = await stmt.first("total");
    return total;
  } catch (e) {
    console.log(e);
    return null;
  }
}
