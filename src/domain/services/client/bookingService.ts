import { trpcClient } from "src/domain/infra/trpcClientActions";
import type { Booking, BookingCreate } from "src/domain/models/BookingModel";
import type { CommonParams } from "src/domain/models/CommonModel";

export async function bookingGetAllByUser(
  params: CommonParams & { userId: number }
) {
  try {
    const response = await trpcClient.booking.getAllByUser.query(params);
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
