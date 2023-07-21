import type { Bindings } from "src/server";
import type { CommonParams } from "../models/CommonModel";
import type { Booking, BookingCreate } from "../models/BookingModel";

export async function bookingDbGetAll(
  params: CommonParams,
  bindings: Bindings
) {
  const { size } = params;

  try {
    const results = await bindings.DB.prepare("SELECT * FROM bookings LIMIT ?")
      .bind(size)
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
  const { start, end, teacherId, studentId } = values;
  const date = Date.now();

  try {
    const stmt = await bindings.DB.prepare(
      "INSERT INTO bookings (start, end, teacherId, studentId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(start, end, teacherId, studentId, date, date)
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
