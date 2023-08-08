import { bookingDbGetAllByDate } from "src/domain/repositories/bookingRepo";
import { userDbGet } from "src/domain/repositories/userRepo";
import type { Bindings } from "src/server";
import { messageSend } from "./messageService";

export async function cronRemindClass(bindings: Bindings) {
  const start = Date.now();
  const end = start + 24 * 60 * 60 * 1000;

  const bookings = await bookingDbGetAllByDate({ start, end }, bindings);
  if (!bookings) {
    throw new Error("Failed to get bookings");
  }

  for (const booking of bookings) {
    const userId = booking.studentId ?? 0;
    const user = await userDbGet({ userId }, bindings);
    const teacher = await userDbGet({ userId: booking.teacherId }, bindings);

    if (user && teacher && user.phone) {
      const classTime = new Date(booking.start).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      const message = `You have a class with teacher ${booking.teacher?.firstName} ${booking.teacher?.lastName} at ${classTime}!`;
      await messageSend({
        content: message,
        mobile: user.phone,
      });
    }
  }

  return true;
}
