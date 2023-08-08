import { TRPCError } from "@trpc/server";
import type { TrpcError } from "../../models/TrpcModel";
import type { ScheduleCreate } from "src/domain/models/ScheduleModel";

export function utilSuccessApiResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://esl-cca.pages.dev",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
    status,
  });
}

export function utilGetTimestampTimeOnly(timestamp: number) {
  const hour = new Date(timestamp).getUTCHours();
  const minute = new Date(timestamp).getUTCMinutes();
  const timestampTimeOnly = hour * 60 * 60 * 1000 + minute * 60 * 1000;

  return timestampTimeOnly;
}

export function utilGetTimestampDateOnly(timestamp: number) {
  const day = new Date(timestamp).getUTCDay();

  const date = new Date(0);
  date.setUTCMonth(1);
  date.setUTCDate(day + 1);

  return date.getTime();
}

export function utilFailedApiResponse(message: string, status: number = 500) {
  let title = "Internal Server Error";
  switch (status) {
    case 400:
      title = "Bad Request";
      break;
    case 401:
      title = "Unauthorized";
      break;
    case 403:
      title = "Forbidden";
      break;
    case 404:
      title = "Not Found";
      break;
  }

  return new Response(
    JSON.stringify({
      errors: [
        {
          title,
          message,
        },
      ],
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
      },
      status,
    }
  );
}

export function utilFailedResponse(message: string, status: number = 500) {
  let code: TrpcError = "INTERNAL_SERVER_ERROR";
  switch (status) {
    case 400:
      code = "BAD_REQUEST";
      break;
    case 401:
      code = "UNAUTHORIZED";
      break;
    case 403:
      code = "FORBIDDEN";
      break;
    case 404:
      code = "NOT_FOUND";
      break;
  }

  return new TRPCError({
    code,
    message,
  });
}

export function utilValidOrigin(origin: string) {
  const allowedOrigin = [
    "http://localhost:3000",
    "https://esl-cca.pages.dev",
    "https://trpc.esl-cca.pages.dev",
    "https://dev.esl-cca.pages.dev",
  ];

  if (allowedOrigin.includes(origin)) {
    return true;
  }

  return false;
}

export function utilValidateCommonParams(params?: any) {
  if (!params) {
    params = {};
  }

  params.page = params.page ?? 0;
  params.size = params.size ?? 10;

  if (typeof params.page === "string") {
    params.page = Number(params.page);
  }

  return params;
}

export function utilCheckScheduleOverlap(schedules: ScheduleCreate[]) {
  let overlapped = false;
  // Fix the day and convert the time to timestamp
  const newSchedules = schedules.map((schedule, index) => {
    const day = new Date(schedule.startTime).getUTCDay();
    const startTime = utilGetTimestampTimeOnly(schedule.startTime);
    const endTime = startTime + (schedule.endTime - schedule.startTime);
    return {
      ...schedule,
      startTime,
      endTime,
      day,
      id: index,
    };
  });

  newSchedules.forEach((old) => {
    const overlap = newSchedules.find((schedule) => {
      return (
        schedule.id !== old.id &&
        schedule.day === old.day &&
        ((schedule.startTime >= old.startTime &&
          schedule.startTime < old.endTime) ||
          (schedule.endTime > old.startTime && schedule.endTime <= old.endTime))
      );
    });

    if (overlap) {
      overlapped = true;
    }
  });

  return overlapped;
}
