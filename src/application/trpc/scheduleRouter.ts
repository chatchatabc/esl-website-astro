import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { CommonParams } from "src/domain/models/CommonModel";
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
