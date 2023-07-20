import type { CommonParams } from "src/domain/models/CommonModel";
import {
  scheduleDbGet,
  scheduleDbGetTotal,
  scheduleDbInsert,
} from "src/domain/repositories/scheduleRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";
import type { Schedule, ScheduleCreate } from "src/domain/models/ScheduleModel";

export async function scheduleGet(params: CommonParams, bindings: Bindings) {
  const { page, size } = params;
  const query = await scheduleDbGet(params, bindings);
  const total = await scheduleDbGetTotal(bindings);

  if (!query || !total) {
    throw utilFailedResponse("Error", 404);
  }

  return {
    content: query.results as any as Schedule[],
    total,
    page,
    size,
  };
}

export async function scheduleCreate(
  values: ScheduleCreate,
  bindings: Bindings
) {
  const success = await scheduleDbInsert(values, bindings);

  if (!success) {
    throw utilFailedResponse("Failed to create scedule", 500);
  }

  return true;
}
