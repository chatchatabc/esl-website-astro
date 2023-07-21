import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { BookingCreate } from "src/domain/models/BookingModel";
import { bookingCreate } from "src/domain/services/server/bookingService";
import { utilFailedResponse } from "src/domain/services/server/utilService";

export default trpcRouterCreate({
  create: trpcProcedure
    .input((values) => {
      const data = values as BookingCreate;

      if (!data.end || !data.start || !data.studentId || !data.teacherId) {
        throw utilFailedResponse("Missing fields", 400);
      } else if (data.start > data.end) {
        throw utilFailedResponse("Incorrect start and end date", 400);
      } else if (data.start % 1800 !== 0) {
        throw utilFailedResponse("Incorrect start date", 400);
      } else if (data.end % 1800 !== 0) {
        throw utilFailedResponse("Incorrect end date", 400);
      }

      return data;
    })
    .mutation(async (opts) => {
      return bookingCreate(opts.input, opts.ctx.env);
    }),
});
