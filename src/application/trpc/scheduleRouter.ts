import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { CommonParams } from "src/domain/models/CommonModel";
import type { ScheduleCreate } from "src/domain/models/ScheduleModel";
import {
  scheduleCreate,
  scheduleGet,
} from "src/domain/services/server/scheduleService";
import {
  utilFailedResponse,
  utilValidateCommonParams,
} from "src/domain/services/server/utilService";

export const scheduleRouter = trpcRouterCreate({
  get: trpcProcedure.query(() => {
    return "Get Schedule";
  }),

  getAll: trpcProcedure
    .input((values) => {
      return utilValidateCommonParams(values as CommonParams);
    })
    .query((opts) => {
      return scheduleGet(opts.input, opts.ctx.env);
    }),

  create: trpcProcedure
    .input((value) => {
      const data = value as ScheduleCreate;

      if (!data) {
        throw utilFailedResponse("Bad Request", 400);
      } else if (
        !data.status ||
        !data.teacherId ||
        !data.endDate ||
        !data.startDate
      ) {
        throw utilFailedResponse("Missing fields", 400);
      } else if (data.startDate > data.endDate) {
        throw utilFailedResponse("Incorrect start and end date", 400);
      } else if (data.startDate % 1800 !== 0) {
        throw utilFailedResponse("Incorrect start date", 400);
      } else if (data.endDate % 1800 !== 0) {
        throw utilFailedResponse("Incorrect end date", 400);
      }

      return data;
    })
    .mutation((opts) => {
      return scheduleCreate(opts.input, opts.ctx.env);
    }),
});
