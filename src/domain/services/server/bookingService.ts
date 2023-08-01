import type { Booking, BookingCreate } from "src/domain/models/BookingModel";
import {
  bookingDbGetAllByUser,
  bookingDbGetOverlap,
  bookingDbInsert,
  bookingDbTotalByUser,
  bookingDbUpdate,
} from "src/domain/repositories/bookingRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";
import { scheduleDbValidateBooking } from "src/domain/repositories/scheduleRepo";
import type { CommonParams } from "src/domain/models/CommonModel";
import { userGet } from "./userService";
import { teacherGet } from "./teacherService";

export async function bookingCreate(values: BookingCreate, bindings: Bindings) {
  const student = await userGet({ userId: values.studentId ?? 0 }, bindings);
  if (!student) {
    throw utilFailedResponse("Student does not exist", 400);
  }

  const teacher = await teacherGet({ userId: values.teacherId }, bindings);
  if (!teacher) {
    throw utilFailedResponse("Teacher does not exist", 400);
  }

  const validSchedule = await scheduleDbValidateBooking(values, bindings);
  if (!validSchedule) {
    throw utilFailedResponse("Schedule does not exist", 400);
  }

  const overlap = await bookingDbGetOverlap(values, bindings);
  if (overlap) {
    throw utilFailedResponse("Booking overlaps", 400);
  }

  const start = new Date(values.start).getTime();
  const end = new Date(values.end).getTime();
  const price = teacher.price * ((end - start) / 1800000);
  if (price > student.credit) {
    throw utilFailedResponse("Not enough credit", 400);
  }
  student.credit -= price;

  const logsCredit = {
    senderId: student.id,
    receiverId: teacher.id,
    amount: price,
    status: 0,
  };
  // if booked schedule starts less than 6 hours
  if (values.start - Date.now() < 21600000) {
    logsCredit.status = 1;
  }

  const success = await bookingDbInsert(values, student, logsCredit, bindings);
  if (!success) {
    throw utilFailedResponse("Failed to create Booking", 500);
  }

  return success;
}

export async function bookingGetAllByUser(
  params: CommonParams & { userId: number },
  bindings: Bindings
) {
  const { page, size, userId } = params;

  const bookings = await bookingDbGetAllByUser(params, bindings);
  if (!bookings) {
    throw utilFailedResponse("Cannot GET", 500);
  }
  const total = await bookingDbTotalByUser(userId, bindings);
  if (total === null) {
    throw utilFailedResponse("Cannot GET", 500);
  }
  const data = {
    content: bookings.results as any as Booking[],
    total,
    page,
    size,
  };

  return data;
}

export async function bookingUpdate(values: Booking, bindings: Bindings) {
  const success = await bookingDbUpdate(values, bindings);
  if (!success) {
    throw utilFailedResponse("Failed to create Booking", 500);
  }

  return success;
}
