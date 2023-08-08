import type { CommonParams } from "src/domain/models/CommonModel";
import {
  scheduleDbDeleteMany,
  scheduleDbGetAll,
  scheduleDbGetAllByUser,
  scheduleDbGetAllByUserAndDay,
  scheduleDbGetAllTotal,
  scheduleDbGetAllTotalByDay,
  scheduleDbGetAllTotalByUser,
  scheduleDbGetOverlap,
  scheduleDbGetOverlapMany,
  scheduleDbInsert,
  scheduleDbInsertMany,
  scheduleDbUpdateMany,
} from "src/domain/repositories/scheduleRepo";
import type { Bindings } from "src/server";
import {
  utilCheckScheduleOverlap,
  utilFailedResponse,
  utilGetTimestampDateOnly,
  utilGetTimestampTimeOnly,
} from "./utilService";
import type {
  Schedule,
  ScheduleCreate,
  ScheduleCreateInput,
  ScheduleDayAndUser,
  ScheduleUpdateInput,
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

export async function scheduleUpdateMany(
  params: { userId: number; schedules: ScheduleUpdateInput[] },
  bindings: Bindings
) {
  let { userId, schedules } = params;

  // Get old schedules
  const query = await scheduleDbGetAllByUser({ userId }, bindings);
  if (!query) {
    throw utilFailedResponse("Cannot GET Schedules", 500);
  }

  // Check if all schedules are owned by user
  const oldSchedules = query.results as any as Schedule[];
  if (
    !schedules.every((schedule) => {
      const oldSchedule = oldSchedules.find((s) => s.id === schedule.id);
      return oldSchedule ? true : false;
    })
  ) {
    throw utilFailedResponse("Unauthorized", 401);
  }

  // Fix day & time format
  const newSchedules = schedules.map((schedule) => {
    const day = new Date(schedule.startTime).getUTCDay();
    const startTime =
      utilGetTimestampTimeOnly(schedule.startTime) +
      utilGetTimestampDateOnly(schedule.startTime);
    const endTime = startTime + (schedule.endTime - schedule.startTime);
    return {
      id: schedule.id,
      teacherId: userId,
      day,
      startTime,
      endTime,
    };
  });

  // Merge old and new schedules
  const combinedSchedules = oldSchedules.map((schedule) => {
    const newSchedule = newSchedules.find((s) => s.id === schedule.id);
    return newSchedule ?? schedule;
  });

  // Check if schedules overlap
  let overlapped = utilCheckScheduleOverlap(combinedSchedules);
  if (overlapped) {
    throw utilFailedResponse("Schedule overlaps", 400);
  }

  // Update schedules
  const transaction = await scheduleDbUpdateMany(newSchedules, bindings);
  if (!transaction) {
    throw utilFailedResponse("Failed to update schedules", 500);
  }

  return true;
}

export async function scheduleDeleteMany(
  schedules: Schedule[],
  bindings: Bindings
) {
  const success = await scheduleDbDeleteMany(schedules, bindings);
  if (!success) {
    throw utilFailedResponse("Failed to delete schedules", 500);
  }

  return true;
}

export async function scheduleCreateMany(
  data: { userId: number; schedules: ScheduleCreateInput[] },
  bindings: Bindings
) {
  let { userId, schedules } = data;

  // Fix day & time format
  const newSchedules = schedules.map((schedule) => {
    const day = new Date(schedule.startTime).getUTCDay();
    const startTime = utilGetTimestampTimeOnly(schedule.startTime);
    const endTime = startTime + (schedule.endTime - schedule.startTime);
    return {
      teacherId: userId,
      startTime,
      endTime,
      day,
    };
  });

  let overlapped =
    (await scheduleDbGetOverlapMany(newSchedules, bindings)) ||
    utilCheckScheduleOverlap(newSchedules);
  if (overlapped) {
    throw utilFailedResponse("Schedule overlaps", 400);
  }

  const success = await scheduleDbInsertMany(newSchedules, bindings);
  if (!success) {
    throw utilFailedResponse("Failed to create schedules", 500);
  }

  return true;
}

export async function scheduleGetAllByUser(
  params: CommonParams & { userId: number },
  bindings: Bindings
) {
  const { page, size } = params;

  const query = await scheduleDbGetAllByUser(params, bindings);
  if (!query) {
    throw utilFailedResponse("Cannot GET Schedules", 500);
  }
  const total = await scheduleDbGetAllTotalByUser(params.userId, bindings);
  if (total === null) {
    throw utilFailedResponse("Cannot GET Total Schedules", 500);
  }

  return {
    content: query.results as any as Schedule[],
    total,
    page,
    size,
  };

  // return {
  //   sunday: results.filter((schedule) => schedule.day === 0),
  //   monday: results.filter((schedule) => schedule.day === 1),
  //   tuesday: results.filter((schedule) => schedule.day === 2),
  //   wednesday: results.filter((schedule) => schedule.day === 3),
  //   thursday: results.filter((schedule) => schedule.day === 4),
  //   friday: results.filter((schedule) => schedule.day === 5),
  //   saturday: results.filter((schedule) => schedule.day === 6),
  // };
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
