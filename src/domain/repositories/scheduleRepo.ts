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

export async function scheduleDbUpdateMany(
  schedules: Schedule[],
  bindings: Bindings
) {
  try {
    const stmt = bindings.DB.prepare(
      "UPDATE schedules SET startTime = ?, endTime = ?, updatedAt = ?, teacherId = ?, day = ? WHERE id = ?"
    );
    await bindings.DB.batch(
      schedules.map((schedule) => {
        return stmt.bind(
          schedule.startTime,
          schedule.endTime,
          Date.now(),
          schedule.teacherId,
          schedule.day,
          schedule.id
        );
      })
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
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
  const day = new Date(start).getDay();

  try {
    const stmt = bindings.DB.prepare(
      "SELECT COUNT(*) AS total FROM schedules WHERE teacherId = ? AND startTime <= ? AND endTime >= ? AND day = ?"
    ).bind(
      teacherId,
      utilGetTimestampTimeOnly(start),
      utilGetTimestampTimeOnly(end),
      day
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
  const { teacherId, startTime, endTime } = values;
  try {
    const stmt = bindings.DB.prepare(
      "SELECT COUNT(*) AS total FROM schedules WHERE (teacherId = ? AND ((startTime <= ? AND endTime > ?) OR (startTime < ? AND endTime >= ?)))"
    ).bind(teacherId, startTime, startTime, endTime, endTime);
    const total = await stmt.first("total");
    if (total === 0) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return true;
  }
}

export async function scheduleDbDeleteMany(
  schedules: Schedule[],
  bindings: Bindings
) {
  try {
    const stmt = bindings.DB.prepare("DELETE FROM schedules WHERE id = ?");
    await bindings.DB.batch(
      schedules.map((schedule) => {
        return stmt.bind(schedule.id);
      })
    );
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDbGetOverlapMany(
  schedules: ScheduleCreate[],
  bindings: Bindings
) {
  try {
    const totals = await bindings.DB.batch<Record<string, any>>(
      schedules.map((schedule) => {
        return bindings.DB.prepare(
          "SELECT COUNT(*) AS total FROM schedules WHERE (teacherId = ? AND day = ? AND ((startTime <= ? AND endTime > ?) OR (startTime < ? AND endTime >= ?)))"
        ).bind(
          schedule.teacherId,
          schedule.day,
          schedule.startTime,
          schedule.startTime,
          schedule.endTime,
          schedule.endTime
        );
      })
    );
    const total = totals.reduce((acc, curr) => {
      return acc + curr.results[0].total;
    }, 0);

    if (total === 0) {
      return false;
    }

    return true;
  } catch (e) {
    console.log(e);
    return true;
  }
}

export async function scheduleDbInsert(
  values: ScheduleCreate,
  bindings: Bindings
) {
  try {
    const date = Date.now();
    const { startTime, endTime, teacherId } = values;

    const stmt = bindings.DB.prepare(
      "INSERT INTO schedules (teacherId, day, startTime, endTime, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(teacherId, startTime, endTime, date, date);
    await stmt.run();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function scheduleDbInsertMany(
  schedules: ScheduleCreate[],
  bindings: Bindings
) {
  try {
    const stmt = bindings.DB.prepare(
      "INSERT INTO schedules (teacherId, startTime, endTime, day, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    );
    await bindings.DB.batch(
      schedules.map((schedule) => {
        const date = Date.now();
        return stmt.bind(
          schedule.teacherId,
          schedule.startTime,
          schedule.endTime,
          schedule.day,
          date,
          date
        );
      })
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
