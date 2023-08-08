import { trpcClient } from "src/domain/infra/trpcClientActions";
import type {
  Schedule,
  ScheduleCreateInput,
  ScheduleUpdateInput,
} from "src/domain/models/ScheduleModel";

export async function scheduleGetAllByUser(params: { userId: number }) {
  try {
    const response = await trpcClient.schedule.getAllByUser.query(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

/**
 * Converts a schedule object to a recurring event object for FullCalendar
 * @param schedules
 * @returns recurring event object for FullCalendar
 * @see https://fullcalendar.io/docs/event-object
 */
export function scheduleConvertToRecurringEvent(schedule: Schedule) {
  const startDate = new Date(schedule.startTime);
  const endDate = new Date(schedule.endTime);
  const startTime = startDate.toTimeString().split(" ")[0];
  const endTime = endDate.toTimeString().split(" ")[0];
  const startDay = startDate.getDay();
  const endDay = endDate.getDay();

  if (startDay === endDay) {
    return [
      {
        startTime,
        endTime,
        daysOfWeek: [startDay],
      },
    ];
  }

  return [
    {
      startTime,
      endTime: "23:59:59",
      daysOfWeek: [startDay],
    },
    {
      startTime: "00:00:00",
      endTime,
      daysOfWeek: [endDay],
    },
  ];
}

export async function scheduleUpdateMany(params: {
  userId: number;
  schedules: ScheduleUpdateInput[];
}) {
  try {
    const response = await trpcClient.schedule.updateManyByTeacher.mutate(
      params
    );
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleCreateMany(schedules: ScheduleCreateInput[]) {
  try {
    const response = await trpcClient.schedule.createMany.mutate({ schedules });
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleDeleteMany(schedules: Schedule[]) {
  try {
    const response = await trpcClient.schedule.deleteMany.mutate(schedules);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
