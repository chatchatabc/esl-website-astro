import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import { teacherGet } from "src/domain/services/server/teacherService";
import { utilFailedResponse } from "src/domain/services/server/utilService";

export default trpcRouterCreate({
  get: trpcProcedure
    .input((values: any) => {
      if (!values) {
        throw utilFailedResponse("Missing values", 400);
      } else if (!values.userId) {
        throw utilFailedResponse("Missing values", 400);
      }
      const data = { userId: values.userId as number };
      return data;
    })
    .query((opts) => {
      return teacherGet(opts.input, opts.ctx.env);
    }),
});
