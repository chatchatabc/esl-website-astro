import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { CommonParams } from "src/domain/models/CommonModel";
import type { ScheduleCreate } from "src/domain/models/ScheduleModel";
import {
  scheduleCreate,
  scheduleGetAll,
  scheduleGetAllByUser,
} from "src/domain/services/server/scheduleService";
import {
  utilFailedResponse,
  utilValidateCommonParams,
} from "src/domain/services/server/utilService";

export const scheduleRouter = trpcRouterCreate({
  get: trpcProcedure.query(() => {
    return "Get Schedule";
  }),

  getAllByUser: trpcProcedure
    .input((values) => {
      const data = utilValidateCommonParams(values) as CommonParams & {
        id: number;
      };

      if (!data.id) {
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

  create: trpcProcedure
    .input((value) => {
      const data = value as ScheduleCreate;

      if (!data) {
        throw utilFailedResponse("Missing fields", 400);
      } else if (!data.day || !data.teacherId || !data.end || !data.start) {
        throw utilFailedResponse("Missing fields", 400);
      } else if (data.start > data.end) {
        throw utilFailedResponse("Incorrect start and end date", 400);
      } else if (data.start % 1800 !== 0) {
        throw utilFailedResponse("Incorrect start date", 400);
      } else if (data.end % 1800 !== 0) {
        throw utilFailedResponse("Incorrect end date", 400);
      }

      return data;
    })
    .mutation((opts) => {
      return scheduleCreate(opts.input, opts.ctx.env);
    }),
});
