import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { CommonParams } from "src/domain/models/CommonModel";
import { userGet } from "src/domain/services/server/userService";
import {
  utilFailedResponse,
  utilValidateCommonParams,
} from "src/domain/services/server/utilService";

export default trpcRouterCreate({
  get: trpcProcedure.query(() => {
    return "User Get";
  }),
  getAll: trpcProcedure
    .input((values) => {
      return utilValidateCommonParams(values as CommonParams);
    })
    .query(async (opts) => {
      if (!opts.ctx.userId) {
        throw utilFailedResponse("Invalid Token", 403);
      }
      return userGet(opts.input, opts.ctx.env);
    }),
});
