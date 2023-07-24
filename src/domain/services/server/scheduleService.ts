import type { CommonParams } from "src/domain/models/CommonModel";
import {
  scheduleDbGetAll,
  scheduleDbGetAllByUser,
  scheduleDbGetAllByUserAndDay,
  scheduleDbGetAllTotal,
  scheduleDbGetAllTotalByDay,
  scheduleDbGetAllTotalByUser,
  scheduleDbGetOverlap,
  scheduleDbInsert,
} from "src/domain/repositories/scheduleRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";
import type {
  Schedule,
  ScheduleCreate,
  ScheduleDayAndUser,
} from "src/domain/models/ScheduleModel";

export async function scheduleGetAll(params: CommonParams, bindings: Bindings) {
  const { page, size } = params;
  const query = await scheduleDbGetAll(params, bindings);
  const total = await scheduleDbGetAllTotal(bindings);

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

export async function scheduleGetAllByUserAndDay(
  params: CommonParams & ScheduleDayAndUser,
  bindings: Bindings
) {
  const { page, size } = params;
  const query = await scheduleDbGetAllByUserAndDay(params, bindings);
  if (!query) {
    throw utilFailedResponse("Cannot GET Schedules", 500);
  }

  const total = await scheduleDbGetAllTotalByDay(params, bindings);
  if (total === null) {
    throw utilFailedResponse("Cannot GET Total Schedules", 500);
  }

  return {
    content: query.results as any as Schedule[],
    total,
    page,
    size,
  };
}

export async function scheduleGetAllByUser(
  params: CommonParams & { id: number },
  bindings: Bindings
) {
  const { page, size } = params;
  const query = await scheduleDbGetAllByUser(params, bindings);
  if (!query) {
    throw utilFailedResponse("Cannot GET", 500);
  }

  const total = await scheduleDbGetAllTotalByUser(params.id, bindings);
  if (total === null) {
    throw utilFailedResponse("Cannot GET", 500);
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
  const overlap = await scheduleDbGetOverlap(values, bindings);
  if (overlap) {
    throw utilFailedResponse("Schedule overlaps", 400);
  }

  const success = await scheduleDbInsert(values, bindings);
  if (!success) {
    throw utilFailedResponse("Failed to create schedule", 500);
  }

  return true;
}
