import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { CommonParams } from "src/domain/models/CommonModel";
import type {
  Schedule,
  ScheduleCreate,
  ScheduleDayAndUser,
} from "src/domain/models/ScheduleModel";
import {
  scheduleCreate,
  scheduleCreateMany,
  scheduleDeleteMany,
  scheduleGetAll,
  scheduleGetAllByUser,
  scheduleGetAllByUserAndDay,
  scheduleUpdateMany,
} from "src/domain/services/server/scheduleService";
import {
  utilFailedResponse,
  utilValidateCommonParams,
} from "src/domain/services/server/utilService";

export const scheduleRouter = trpcRouterCreate({
  get: trpcProcedure.query(() => {
    return "Get Schedule";
  }),

  getAllByUserAndDay: trpcProcedure
    .input((values) => {
      const data = utilValidateCommonParams(values) as CommonParams &
        ScheduleDayAndUser;
      if (!data.day || !data.userId) {
        throw utilFailedResponse("Missing values", 400);
      }
      return data;
    })
    .query((opts) => {
      return scheduleGetAllByUserAndDay(opts.input, opts.ctx.env);
    }),

  getAllByUser: trpcProcedure
    .input((values) => {
      const data = values as {
        userId: number;
      };

      if (!data.userId) {
        throw utilFailedResponse("Missing values", 400);
      }

      return data;
    })
    .query((opts) => {
      return scheduleGetAllByUser(opts.input, opts.ctx.env);
    }),

  getAll: trpcProcedure
    .input((values) => {
      return utilValidateCommonParams(values) as CommonParams;
    })
    .query((opts) => {
      return scheduleGetAll(opts.input, opts.ctx.env);
    }),

  updateManyByTeacher: trpcProcedure
    .input((values: any = {}) => {
      if (!values.schedules) {
        throw utilFailedResponse("Missing schedules", 400);
      }

      // Clean up the schedules input
      values.schedule = values.schedules.map((schedule: Schedule) => {
        if (
          !schedule.id ||
          !schedule.endTime ||
          !schedule.startTime ||
          !schedule.teacherId
        ) {
          throw utilFailedResponse("Missing fields in schedules", 400);
        } else if (schedule.startTime > schedule.endTime) {
          throw utilFailedResponse("Start time should not be after end time");
        }

        return {
          id: schedule.id,
          teacherId: schedule.teacherId,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        };
      });

      return values as {
        userId?: number;
        schedules: Schedule[];
      };
    })
    .mutation((opts) => {
      const { userId = 0, env } = opts.ctx;

      // If admin is updating a user's schedule
      if (opts.input.userId && userId === 1) {
        return scheduleUpdateMany(
          { userId: opts.input.userId, schedules: opts.input.schedules },
          env
        );
      }

      // Check if the user is updating their own schedule
      opts.input.schedules.forEach((schedule) => {
        if (schedule.teacherId !== userId) {
          throw utilFailedResponse("Unauthorized", 401);
        }
      });

      return scheduleUpdateMany({ ...opts.input, userId }, env);
    }),

  create: trpcProcedure
    .input((value) => {
      const data = value as ScheduleCreate;

      if (!data) {
        throw utilFailedResponse("Missing fields", 400);
      } else if (!data.teacherId || !data.endTime || !data.startTime) {
        throw utilFailedResponse("Missing fields", 400);
      } else if (data.startTime > data.endTime) {
        throw utilFailedResponse("Incorrect start and end date", 400);
      } else if (data.startTime % 1800 !== 0) {
        throw utilFailedResponse("Incorrect start date", 400);
      } else if (data.endTime % 1800 !== 0) {
        throw utilFailedResponse("Incorrect end date", 400);
      }

      return data;
    })
    .mutation((opts) => {
      return scheduleCreate(opts.input, opts.ctx.env);
    }),

  createMany: trpcProcedure
    .input((values: any = []) => {
      const data = values.map((value: any) => {
        if (!value.teacherId || !value.startTime || !value.endTime) {
          throw utilFailedResponse("Missing fields", 400);
        } else if (value.startTime > value.endTime) {
          throw utilFailedResponse("Start time cannot be after end time", 400);
        }

        return {
          teacherId: value.teacherId,
          startTime: value.startTime,
          endTime: value.endTime,
        };
      });

      return data as {
        teacherId: number;
        startTime: number;
        endTime: number;
      }[];
    })
    .mutation((opts) => {
      return scheduleCreateMany(opts.input, opts.ctx.env);
    }),

  deleteMany: trpcProcedure
    .input((value) => {
      const data = value as Schedule[];
      return data;
    })
    .mutation((opts) => {
      return scheduleDeleteMany(opts.input, opts.ctx.env);
    }),
});
