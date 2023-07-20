import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { CommonParams } from "src/domain/models/CommonModel";
import type { ScheduleCreate } from "src/domain/models/ScheduleModel";
import { scheduleGet } from "src/domain/services/server/scheduleService";
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
      if (!opts.ctx.userId) {
        throw utilFailedResponse("Invalid Token", 403);
      }

      return scheduleGet(opts.input, opts.ctx.env);
    }),

  create: trpcProcedure
    .input((value) => {
      const data = value as ScheduleCreate;

      if (!data) {
        throw utilFailedResponse("Bad Request", 400);
      }
      if (!data.status || !data.teacherId || !data.endDate || !data.startDate) {
        throw utilFailedResponse("Missing fields", 400);
      }

      return data;
    })
    .mutation(() => {
      return "Schedule Mutate";
    }),
});
