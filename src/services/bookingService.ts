import { trpcClient } from "src/infra/trpc";
import { userGet } from "./userService";
import type {
  BookingCreate,
  BookingCreateInput,
} from "../../../esl-backend-workers/src/domain/models/BookingModel";
import type { CommonPaginationInput } from "../../../esl-backend-workers/src/domain/models/CommonModel";
import { teacherGet } from "./teacherService";

export async function bookingGetAll(params: CommonPaginationInput) {
  try {
    const response = await trpcClient.booking.getAll.query(params);

    const contentPromise = response.content.map(async (booking) => {
      const user = await userGet({ userId: booking.userId ?? 0 });
      if (user) {
        booking.user = user;
      }

      const teacher = await teacherGet({ teacherId: booking.teacherId ?? 0 });
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
      const user = await userGet({ userId: booking.userId ?? 0 });
      if (user) {
        booking.user = user;
      }

      const teacher = await teacherGet({ teacherId: booking.teacherId ?? 0 });
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

export async function bookingCreate(params: BookingCreateInput) {
  try {
    const response = await trpcClient.booking.create.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function bookingCancel(params: { id: number }) {
  try {
    const response = await trpcClient.booking.cancel.mutate(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
