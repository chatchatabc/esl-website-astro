import type { CommonParams } from "src/domain/models/CommonModel";
import {
  utilFailedResponse,
  utilValidateCommonParams,
} from "../../domain/services/server/utilService";
import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import { userGet } from "src/domain/services/server/userService";
import { scheduleGet } from "src/domain/services/server/scheduleService";

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
      return values as CommonParams;
    })
    .query((opts) => {
      if (!opts.ctx.userId) {
        throw utilFailedResponse("Invalid Token", 403);
      }
      const params = utilValidateCommonParams(opts.input);

      return scheduleGet(params, opts.ctx.env);
    }),
});

export type TrpcRouter = typeof trpcRouter;
