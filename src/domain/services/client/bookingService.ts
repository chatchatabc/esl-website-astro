import { trpcClient } from "src/domain/infra/trpcClientActions";
import type { Booking, BookingCreate } from "src/domain/models/BookingModel";
import { userGet } from "./userService";

export async function bookingGetAll(params: { page?: number; size?: number }) {
  try {
    const response = await trpcClient.booking.getAll.query(params);

    const contentPromise = response.map(async (booking) => {
      const student = await userGet({ userId: booking.studentId ?? 0 });
      if (student) {
        booking.student = student;
      }

      const teacher = await userGet({ userId: booking.teacherId ?? 0 });
      if (teacher) {
        booking.teacher = teacher;
      }
      return booking;
    });
    const content = await Promise.all(contentPromise);

    return content;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingGetAllByUser(params: {
  userId: number;
  page?: number;
  size?: number;
}) {
  try {
    const response = await trpcClient.booking.getAllByUser.query(params);

    const contentPromise = response.map(async (booking) => {
      const student = await userGet({ userId: booking.studentId ?? 0 });
      if (student) {
        booking.student = student;
      }

      const teacher = await userGet({ userId: booking.teacherId ?? 0 });
      if (teacher) {
        booking.teacher = teacher;
      }
      return booking;
    });
    const content = await Promise.all(contentPromise);

    return content;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingCreate(params: BookingCreate) {
  try {
    const response = await trpcClient.booking.create.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingUpdate(params: Booking) {
  try {
    const response = await trpcClient.booking.update.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingCancel(params: { bookingId: number }) {
  try {
    const response = await trpcClient.booking.cancel.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
