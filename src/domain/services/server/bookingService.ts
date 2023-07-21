import type { BookingCreate } from "src/domain/models/BookingModel";
import {
  bookingDbGetAllByUser,
  bookingDbGetOverlap,
  bookingDbInsert,
  bookingDbTotalByUser,
} from "src/domain/repositories/bookingRepo";
import type { Bindings } from "src/server";
import { utilFailedResponse } from "./utilService";
import { scheduleDbValidateBooking } from "src/domain/repositories/scheduleRepo";

export async function bookingCreate(values: BookingCreate, bindings: Bindings) {
  const validSchedule = await scheduleDbValidateBooking(values, bindings);
  if (!validSchedule) {
    throw utilFailedResponse("Schedule does not exist", 400);
  }

  const overlap = await bookingDbGetOverlap(values, bindings);
  if (overlap) {
    throw utilFailedResponse("Booking overlaps", 400);
  }

  const success = await bookingDbInsert(values, bindings);
  if (!success) {
    throw utilFailedResponse("Failed to create Booking", 500);
  }

  return success;
}

export async function bookingGetAllByUser(
  params: Record<string, any>,
  bindings: Bindings
) {
  const { page, size, id } = params;

  const bookings = await bookingDbGetAllByUser(params, bindings);
  if (!bookings) {
    throw utilFailedResponse("Cannot GET", 500);
  }
  const total = await bookingDbTotalByUser(id, bindings);
  if (total === null) {
    throw utilFailedResponse("Cannot GET", 500);
  }
  const data = {
    content: bookings.results,
    total,
    page,
    size,
  };

  return data;
}
