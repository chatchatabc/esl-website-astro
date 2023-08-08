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

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
  });
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  });
  const userIds: number[] = [];

  for (const booking of bookings) {
    const userId = booking.studentId ?? 0;
    const student = await userDbGet({ userId }, bindings);
    const teacher = await userDbGet({ userId: booking.teacherId }, bindings);

    if (!userIds.includes(userId) && student && teacher && student.phone) {
      const classes = bookings.filter((b) => b.studentId === userId);
      const message = `Hi ${student.username}, soon you will have ${classes.length} classes in this following time:`;

      for (const c of classes) {
        const startTime = timeFormatter.format(new Date(booking.start));
        const endTime = timeFormatter.format(new Date(booking.end));
        const date = dateFormatter.format(new Date(booking.start));
        message.concat(
          `\n${startTime}-${endTime}@${date} with teacher ${teacher.firstName} ${teacher.lastName}}`
        );
      }

      await messageSend({
        content: message,
        mobile: student.phone,
      });
      userIds.push(userId);
    }
  }

  return true;
}
