import type { Bindings } from "src/server";
import type { Booking, BookingCreate } from "../models/BookingModel";
import type { CommonParams } from "../models/CommonModel";

export async function bookingDbTotalByUser(id: number, bindings: Bindings) {
  try {
    const stmt = bindings.DB.prepare(
      "SELECT COUNT(*) AS total FROM bookings WHERE teacherId = ? OR studentId = ?"
    ).bind(id, id);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbGetAllByUser(
  params: CommonParams & { userId: number },
  bindings: Bindings
) {
  const { userId, size } = params;

  try {
    const results = await bindings.DB.prepare(
      "SELECT * FROM bookings WHERE teacherId = ? OR studentId = ? LIMIT ?"
    )
      .bind(userId, userId, size)
      .all<Booking>();

    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingDbInsert(
  values: BookingCreate,
  bindings: Bindings
) {
  const { start, end, teacherId, studentId, status } = values;
  const date = Date.now();

  try {
    const stmt = await bindings.DB.prepare(
      "INSERT INTO bookings (start, end, teacherId, status, studentId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(start, end, teacherId, status, studentId, date, date)
      .run();

    return stmt.success;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function bookingDbGetOverlap(
  values: BookingCreate,
  bindings: Bindings
) {
  const { start, end, teacherId, studentId } = values;
  try {
    const stmt = bindings.DB.prepare(
      "SELECT COUNT(*) AS total FROM bookings WHERE (start BETWEEN ? AND ? OR end BETWEEN ? AND ?) AND (teacherId = ? OR studentId = ?)"
    ).bind(start, end, start, end, teacherId, studentId);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return 0;
  }
}
