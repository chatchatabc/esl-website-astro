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
  utilGetTimestampTimeOnly,
} from "./utilService";
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

export async function scheduleUpdateMany(
  params: { userId: number; schedules: Schedule[] },
  bindings: Bindings
) {
  let { userId, schedules } = params;
  schedules = schedules.map((schedule) => {
    return {
      ...schedule,
      startTime: utilGetTimestampTimeOnly(schedule.startTime),
      endTime: utilGetTimestampTimeOnly(schedule.endTime),
    };
  });

  const correctTimeFormat = schedules.every((schedule) => {
    return schedule.startTime < schedule.endTime;
  });
  if (!correctTimeFormat) {
    throw utilFailedResponse("Incorrect time format", 400);
  }

  const query = await scheduleDbGetAllByUser({ userId }, bindings);
  if (!query) {
    throw utilFailedResponse("Cannot GET Schedules", 500);
  }

  const oldSchedules = query.results as any as Schedule[];
  const combinedSchedules = oldSchedules.map((schedule) => {
    const newSchedule = schedules.find((s) => s.id === schedule.id);
    return newSchedule ? newSchedule : schedule;
  });

  let overlapped = utilCheckScheduleOverlap(combinedSchedules);
  if (overlapped) {
    throw utilFailedResponse("Schedule overlaps", 400);
  }

  const transaction = await scheduleDbUpdateMany(schedules, bindings);
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
  data: { startTime: number; endTime: number; teacherId: number }[],
  bindings: Bindings
) {
  // Fix day & time format
  const schedules = data.map((schedule) => {
    const day = new Date(schedule.startTime).getUTCDay() * 24 * 60 * 60 * 1000;
    const startTime = utilGetTimestampTimeOnly(schedule.startTime) + day;
    const endTime = startTime + (schedule.endTime - schedule.startTime);
    return {
      ...schedule,
      startTime,
      endTime,
    };
  });

  let overlapped =
    (await scheduleDbGetOverlapMany(schedules, bindings)) ||
    utilCheckScheduleOverlap(schedules);
  if (overlapped) {
    throw utilFailedResponse("Schedule overlaps", 400);
  }

  const success = await scheduleDbInsertMany(schedules, bindings);
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
