import type { Bindings } from "src/server";
import type { CommonParams } from "../models/CommonModel";
import type {
  Schedule,
  ScheduleCreate,
  ScheduleDayAndUser,
} from "../models/ScheduleModel";
import type { BookingCreate } from "../models/BookingModel";
import { utilGetTimestampTimeOnly } from "../services/server/utilService";

export async function scheduleDbGetAll(
  params: CommonParams,
  bindings: Bindings
) {
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

export async function scheduleDbGetAllByUserAndDay(
  params: CommonParams & ScheduleDayAndUser,
  bindings: Bindings
) {
  const { day, size, userId } = params;

  try {
    const results = await bindings.DB.prepare(
      "SELECT * FROM schedules WHERE day = ? AND teacherId = ? LIMIT ?"
    )
      .bind(day, userId, size)
      .all<Schedule>();
    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbGetAllTotalByDay(
  params: ScheduleDayAndUser,
  bindings: Bindings
) {
  const { day, userId } = params;
  try {
    const stmt = bindings.DB.prepare(
      "SELECT COUNT(*) AS total FROM schedules WHERE day = ? AND teacherId = ?"
    ).bind(day, userId);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbGetAllByUser(
  params: { userId: number },
  bindings: Bindings
) {
  const { userId } = params;

  try {
    const results = await bindings.DB.prepare(
      "SELECT * FROM schedules WHERE teacherId = ?"
    )
      .bind(userId)
      .all<Schedule>();
    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbGetAllTotalByUser(
  id: number,
  bindings: Bindings
) {
  try {
    const stmt = bindings.DB.prepare(
      "SELECT COUNT(*) AS total FROM schedules WHERE teacherId = ?"
    ).bind(id);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbGetAllTotal(bindings: Bindings) {
  try {
    const stmt = bindings.DB.prepare("SELECT COUNT(*) AS total FROM schedules");
    const total = await stmt.first("total");
    return total;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbValidateBooking(
  booking: BookingCreate,
  bindings: Bindings
) {
  const { start, end, teacherId } = booking;

  try {
    const stmt = bindings.DB.prepare(
      "SELECT COUNT(*) AS total FROM schedules WHERE teacherId = ? AND startTime <= ? AND endTime >= ?"
    ).bind(
      teacherId,
      utilGetTimestampTimeOnly(start),
      utilGetTimestampTimeOnly(end)
    );
    const total = await stmt.first("total");
    if (total === 0) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function scheduleDbGetOverlap(
  values: ScheduleCreate,
  bindings: Bindings
) {
  const { day, start, end } = values;
  try {
    const stmt = bindings.DB.prepare(
      "SELECT COUNT(*) AS total FROM schedules WHERE (day = ? AND ((start <= ? AND end > ?) OR (start < ? AND end >= ?)))"
    ).bind(day, start, start, end, end);
    const total = await stmt.first("total");
    if (total === 0) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function scheduleDbInsert(
  values: ScheduleCreate,
  bindings: Bindings
) {
  try {
    const date = Date.now();
    const start = utilGetTimestampTimeOnly(values.start);
    const end = utilGetTimestampTimeOnly(values.end);

    const stmt = bindings.DB.prepare(
      "INSERT INTO schedules (teacherId, day, startTime, endTime, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(values.teacherId, values.day, start, end, date, date);
    await stmt.run();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
