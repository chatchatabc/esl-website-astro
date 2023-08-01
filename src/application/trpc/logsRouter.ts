import {
  trpcProcedure,
  trpcProcedureAdmin,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import {
  logsApproveCredit,
  logsGetAllCredit,
} from "src/domain/services/server/logsService";
import { utilFailedResponse } from "src/domain/services/server/utilService";

export default trpcRouterCreate({
  getCreditAll: trpcProcedure
    .input((values: any = {}) => {
      const data = {
        page: values.page ?? 0,
        size: values.size ?? 10,
      };
      return data;
    })
    .query((opts) => {
      const { userId, env } = opts.ctx;
      return logsGetAllCredit({ userId: userId ?? 0 }, env);
    }),

  approveCredit: trpcProcedureAdmin
    .input((values: any = {}) => {
      if (!values.logId) {
        throw utilFailedResponse("Missing fields", 400);
      }
      const data = {
        logId: values.logId,
      } as { logId: number };
      return data;
    })
    .mutation((opts) => {
      return logsApproveCredit(opts.input, opts.ctx.env);
    }),
});
