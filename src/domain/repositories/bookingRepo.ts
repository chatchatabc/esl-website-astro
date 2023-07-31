import type { Bindings } from "src/server";
import type { Booking, BookingCreate } from "../models/BookingModel";
import type { CommonParams } from "../models/CommonModel";
import { utilFailedResponse } from "../services/server/utilService";
import type { User } from "../models/UserModel";

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
  student: User,
  price: number,
  bindings: Bindings
) {
  const {
    start = null,
    end = null,
    teacherId = null,
    studentId = null,
    status = null,
  } = values;
  const date = Date.now();

  try {
    const userStmt = bindings.DB.prepare(
      "UPDATE users SET credit = ? WHERE id = ?"
    ).bind(student.credit, values.studentId);
    const bookingStmt = bindings.DB.prepare(
      "INSERT INTO bookings (start, end, teacherId, status, studentId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(start, end, teacherId, status, studentId, date, date);
    const logsStmt = bindings.DB.prepare(
      "INSERT INTO logsCredit (senderId, receiverId, amount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)"
    ).bind(studentId, teacherId, price, date, date);

    await bindings.DB.batch([bookingStmt, userStmt, logsStmt]);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function bookingDbUpdate(values: Booking, bindings: Bindings) {
  const { start, end, teacherId, studentId, status, id } = values;
  const date = Date.now();

  const overlap = await bookingDbGetOverlap(values, bindings);
  if (overlap) {
    throw utilFailedResponse("Booking overlaps", 400);
  }

  try {
    const stmt = await bindings.DB.prepare(
      "UPDATE bookings SET start = ?, end = ?, teacherId = ?, status = ?, studentId = ?, updatedAt = ? WHERE id = ?"
    )
      .bind(start, end, teacherId, status, studentId, date, id)
      .run();

    return stmt.success;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function bookingDbGetOverlap(
  values: BookingCreate & { id?: number },
  bindings: Bindings
) {
  const { start, end, teacherId, studentId, id } = values;
  try {
    const stmt = bindings.DB.prepare(
      "SELECT COUNT(*) AS total FROM bookings WHERE ((start <= ? AND end > ?) OR (start < ? AND end >= ?)) AND (teacherId = ? OR studentId = ?) AND id != ? AND status = 1"
    ).bind(start, start, end, end, teacherId, studentId, id ?? 0);
    const total = await stmt.first("total");
    return total as number;
  } catch (e) {
    console.log(e);
    return 0;
  }
}
