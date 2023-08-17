import { trpcClient } from "src/infra/trpc";
import type {
  Schedule,
  ScheduleCreateInput,
  ScheduleUpdateInput,
} from "../../../esl-workers/src/domain/models/ScheduleModel";

export async function scheduleGetAll(params: { userId: number }) {
  try {
    const response = await trpcClient.schedule.getAll.query(params);
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
  schedules: ScheduleUpdateInput[];
}) {
  try {
    const response = await trpcClient.schedule.updateMany.mutate(params);
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
    const response = await trpcClient.schedule.deleteMany.mutate({
      scheduleIds: schedules.map((schedule) => schedule.id),
    });
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
