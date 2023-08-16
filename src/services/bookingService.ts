import { trpcClient } from "src/infra/trpc";
import { userGet } from "./userService";
import type { BookingCreate } from "../../../esl-workers/src/domain/models/BookingModel";
import type { CommonPaginationInput } from "../../../esl-workers/src/domain/models/CommonModel";

export async function bookingGetAll(params: CommonPaginationInput) {
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

export async function bookingGetAllByUser(params: {
  userId: number;
  page?: number;
  size?: number;
}) {
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

export async function bookingCreate(params: BookingCreate) {
  try {
    const response = await trpcClient.booking.create.mutate(params);
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
