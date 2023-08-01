import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import { logsGetAllCredit } from "src/domain/services/server/logsService";

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
});
