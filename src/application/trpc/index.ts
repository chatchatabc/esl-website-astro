import { utilFailedResponse } from "../../domain/services/server/utilService";
import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";

/**
 * Due to some bugs, we cannot import
 * this router from another file
 */

export const trpcRouter = trpcRouterCreate({
  schedules: trpcProcedure
    .input((values) => {
      return values;
    })
    .query((opts) => {
      if (!opts.ctx.userId) {
        throw utilFailedResponse("Invalid Token", 403);
      }
      return {
        data: {
          content: [],
          total: 0,
          page: 0,
          size: 10,
        },
      };
    }),
});

export type TrpcRouter = typeof trpcRouter;
