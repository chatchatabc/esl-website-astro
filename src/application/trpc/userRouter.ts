import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { CommonParams } from "src/domain/models/CommonModel";
import { userGet } from "src/domain/services/server/userService";
import { utilValidateCommonParams } from "src/domain/services/server/utilService";

export default trpcRouterCreate({
  get: trpcProcedure.query(() => {
    return "User Get";
  }),
  getAll: trpcProcedure
    .input((values) => {
      return utilValidateCommonParams(values as CommonParams);
    })
    .query(async (opts) => {
      return userGet(opts.input, opts.ctx.env);
    }),
});
