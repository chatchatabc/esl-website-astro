import type { Booking, BookingCreate } from "src/domain/models/BookingModel";
import {
  bookingDbCancel,
  bookingDbGet,
  bookingDbGetAllByUser,
  bookingDbGetOverlap,
  bookingDbGetTotalByUser,
  bookingDbInsert,
  bookingDbUpdate,
} from "src/domain/repositories/bookingRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";
import { scheduleDbValidateBooking } from "src/domain/repositories/scheduleRepo";
import { userGet } from "./userService";
import { teacherGet } from "./teacherService";
import type { LogsCreditCreate } from "src/domain/models/LogsModel";

export async function bookingCreate(values: BookingCreate, bindings: Bindings) {
  if (values.studentId === values.teacherId) {
    throw utilFailedResponse("Cannot booked own schedule", 400);
  }

  const student = await userGet({ userId: values.studentId ?? 0 }, bindings);
  if (!student) {
    throw utilFailedResponse("Student does not exist", 400);
  }

  const teacher = await userGet({ userId: values.teacherId }, bindings);
  if (!teacher) {
    throw utilFailedResponse("Teacher does not exist", 400);
  }

  const teacherInfo = await teacherGet({ userId: values.teacherId }, bindings);
  if (!teacherInfo) {
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

  const dateTimeFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const start = new Date(values.start).getTime();
  const end = new Date(values.end).getTime();
  const price = teacherInfo.price * ((end - start) / 1800000);
  if (price > student.credit) {
    throw utilFailedResponse("Not enough credit", 400);
  }

  const logsCredit = {
    senderId: student.id,
    receiverId: teacherInfo.id,
    amount: price,
    title: `Class ${dateTimeFormatter.format(new Date(values.start))}`,
    status: 1,
  };

  teacher.credit += price;
  student.credit -= price;

  const success = await bookingDbInsert(
    values,
    teacher,
    student,
    logsCredit,
    bindings
  );
  if (!success) {
    throw utilFailedResponse("Failed to create Booking", 500);
  }

  return success;
}

export async function bookingGetAllByUser(
  params: { userId: number; page: number; size: number },
  bindings: Bindings
) {
  const { page, size, userId } = params;

  const bookings = await bookingDbGetAllByUser(params, bindings);
  if (!bookings) {
    throw utilFailedResponse("Cannot GET", 500);
  }

  const totalElements = await bookingDbGetTotalByUser({ userId }, bindings);
  if (totalElements === null) {
    throw utilFailedResponse("Cannot GET total", 500);
  }

  return {
    content: bookings.results,
    totalElements,
    page,
    size,
  };
}

export async function bookingUpdate(values: Booking, bindings: Bindings) {
  const success = await bookingDbUpdate(values, bindings);
  if (!success) {
    throw utilFailedResponse("Failed to create Booking", 500);
  }

  return success;
}

export async function bookingCancel(
  values: {
    bookingId: number;
    studentId?: number;
  },
  bindings: Bindings
) {
  const { bookingId, studentId } = values;
  const booking = await bookingDbGet({ bookingId }, bindings);
  if (!booking) {
    throw utilFailedResponse("Can't get booking", 400);
  }

  if (booking.status !== 1) {
    throw utilFailedResponse("Can't cancel booking", 400);
  }

  if (booking.studentId !== studentId) {
    throw utilFailedResponse("Can't get booking", 403);
  }

  if (booking.start < Date.now() + 60 * 60 * 6 * 1000) {
    throw utilFailedResponse(
      "Can't cancel booking before 6 hours of the starting class.",
      400
    );
  }

  const student = await userGet({ userId: studentId ?? 0 }, bindings);
  const teacher = await userGet({ userId: booking.teacherId ?? 0 }, bindings);

  student.credit += booking.amount ?? 0;
  teacher.credit -= booking.amount ?? 0;

  const logs: LogsCreditCreate = {
    title: "Cancelled Class",
    senderId: teacher.id,
    receiverId: student.id,
    amount: booking.amount ?? 0,
    status: 1,
  };

  const cancel = await bookingDbCancel(
    booking,
    teacher,
    student,
    logs,
    bindings
  );

  if (!cancel) {
    throw utilFailedResponse("Was not able to cancel booking", 500);
  }

  return true;
}
