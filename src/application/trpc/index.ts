import type {
  CommonContent,
  CommonParams,
} from "src/domain/models/CommonModel";
import {
  utilFailedResponse,
  utilValidateCommonParams,
} from "../../domain/services/server/utilService";
import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { Schedule } from "src/domain/models/ScheduleModel";
import { userGet } from "src/domain/services/server/userService";
import { userDbGet } from "src/domain/repositories/userRepo";

/**
 * Due to some bugs, we cannot import
 * this router from another file
 */

export const trpcRouter = trpcRouterCreate({
  users: trpcProcedure
    .input((values) => {
      return values as CommonParams;
    })
    .query(async (opts) => {
      if (!opts.ctx.userId) {
        throw utilFailedResponse("Invalid Token", 403);
      }
      const params = utilValidateCommonParams(opts.input);

      return userGet(params, opts.ctx.env);
    }),
  schedules: trpcProcedure
    .input((values) => {
      return values;
    })
    .query((opts) => {
      if (!opts.ctx.userId) {
        throw utilFailedResponse("Invalid Token", 403);
      }
      const data: CommonContent<Schedule> = {
        content: [],
        total: 0,
        page: 0,
        size: 10,
      };
      return { data };
    }),
});

export type TrpcRouter = typeof trpcRouter;
