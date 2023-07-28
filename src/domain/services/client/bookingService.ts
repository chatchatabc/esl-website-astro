import { trpcClient } from "src/domain/infra/trpcClientActions";
import type { Booking, BookingCreate } from "src/domain/models/BookingModel";
import type { CommonParams } from "src/domain/models/CommonModel";
import { userGet } from "./userService";

export async function bookingGetAll(params: CommonParams) {
  try {
    const response = await trpcClient.booking.getAll.query(params);

    const contentPromise = response.content.map(async (booking) => {
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
    response.content = await Promise.all(contentPromise);

    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingGetAllByUser(
  params: CommonParams & { userId: number }
) {
  try {
    const response = await trpcClient.booking.getAllByUser.query(params);

    const contentPromise = response.content.map(async (booking) => {
      const user = await userGet({ userId: booking.studentId ?? 0 });
      if (user) {
        booking.student = user;
      }
      return booking;
    });
    response.content = await Promise.all(contentPromise);

    return response;
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
