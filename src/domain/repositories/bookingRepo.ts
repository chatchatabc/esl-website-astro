import type { Bindings } from "src/server";
import type { Booking, BookingCreate } from "../models/BookingModel";
import type { CommonParams } from "../models/CommonModel";
import { utilFailedResponse } from "../services/server/utilService";
import type { User } from "../models/UserModel";
import type { LogsCredit } from "../models/LogsModel";

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
  teacher: User,
  student: User,
  logsCredit: LogsCredit,
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
    ).bind(student.credit, student.id);
    const teacherStmt = bindings.DB.prepare(
      "UPDATE users SET credit = ? WHERE id = ?"
    ).bind(teacher.credit, teacher.id);
    const bookingStmt = bindings.DB.prepare(
      "INSERT INTO bookings (start, end, teacherId, status, studentId, amount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      start,
      end,
      teacherId,
      status,
      studentId,
      logsCredit.amount,
      date,
      date
    );
    const logsStmt = bindings.DB.prepare(
      "INSERT INTO logsCredit (title, senderId, receiverId, amount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
      logsCredit.title,
      studentId,
      teacherId,
      logsCredit.amount,
      date,
      date
    );

    await bindings.DB.batch([bookingStmt, userStmt, logsStmt, teacherStmt]);
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
