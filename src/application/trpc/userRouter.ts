import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { CommonParams } from "src/domain/models/CommonModel";
import { userGet, userGetAll } from "src/domain/services/server/userService";
import { utilValidateCommonParams } from "src/domain/services/server/utilService";

export default trpcRouterCreate({
  get: trpcProcedure
    .input((values) => {
      const data = values as { userId: number };
      return data;
    })
    .query((opts) => {
      return userGet(opts.input, opts.ctx.env);
    }),
  getAll: trpcProcedure
    .input((values) => {
      return utilValidateCommonParams(values as CommonParams);
    })
    .query(async (opts) => {
      return userGetAll(opts.input, opts.ctx.env);
    }),
});
