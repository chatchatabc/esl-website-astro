import {
  trpcProcedure,
  trpcRouterCreate,
} from "src/domain/infra/trpcServerActions";
import type { Booking, BookingCreate } from "src/domain/models/BookingModel";
import type { CommonParams } from "src/domain/models/CommonModel";
import {
  bookingCancel,
  bookingCreate,
  bookingGetAllByUser,
  bookingUpdate,
} from "src/domain/services/server/bookingService";
import { utilFailedResponse } from "src/domain/services/server/utilService";

export default trpcRouterCreate({
  getAll: trpcProcedure
    .input((values: any = {}) => {
      return values as { page?: number; size?: number };
    })
    .query((opts) => {
      const { page, size } = opts.input;
      const data = {
        page: page ?? 0,
        size: size ?? 10,
        userId: opts.ctx.userId ?? 0,
      };

      return bookingGetAllByUser(data, opts.ctx.env);
    }),

  getAllByUser: trpcProcedure
    .input((values: any = {}) => {
      return values as { userId: number; page?: number; size?: number };
    })
    .query((opts) => {
      const { page, size, ...others } = opts.input;
      const data = {
        page: page ?? 0,
        size: size ?? 10,
        ...others,
      };

      return bookingGetAllByUser(data, opts.ctx.env);
    }),

  create: trpcProcedure
    .input((values: any) => {
      if (!values) {
        throw utilFailedResponse("Missing fields", 400);
      }

      if (
        !values.end ||
        !values.start ||
        !values.studentId ||
        !values.teacherId
      ) {
        throw utilFailedResponse("Missing fields", 400);
      } else if (values.start > values.end) {
        throw utilFailedResponse("Incorrect start and end date", 400);
      } else if (values.start % 1800 !== 0) {
        throw utilFailedResponse("Incorrect start date", 400);
      } else if (values.end % 1800 !== 0) {
        throw utilFailedResponse("Incorrect end date", 400);
      } else if (values.start <= Date.now() || values.end <= Date.now()) {
        throw utilFailedResponse(
          "Cannot booked schedule past the current time.",
          400
        );
      }

      const data = {
        end: values.end,
        start: values.start,
        teacherId: values.teacherId,
        status: 1,
      } as BookingCreate;
      return data;
    })
    .mutation(async (opts) => {
      opts.input.studentId = opts.ctx.userId ?? 0;
      return bookingCreate(opts.input, opts.ctx.env);
    }),

  update: trpcProcedure
    .input((values) => {
      const data = values as Booking;
      return data;
    })
    .mutation(async (opts) => {
      return bookingUpdate(opts.input, opts.ctx.env);
    }),

  cancel: trpcProcedure
    .input((values: any = {}) => {
      if (!values.bookingId) {
        throw utilFailedResponse("Missing fields", 400);
      }

      const data = { bookingId: values.bookingId } as {
        bookingId: number;
        studentId?: number;
      };
      return data;
    })
    .mutation((opts) => {
      opts.input.studentId = opts.ctx.userId ?? 0;
      return bookingCancel(opts.input, opts.ctx.env);
    }),
});
