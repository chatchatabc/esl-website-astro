import { trpcRouterCreate } from "src/domain/infra/trpcServerActions";
import { scheduleRouter } from "./scheduleRouter";
import userRouter from "./userRouter";
import bookingRouter from "./bookingRouter";

export const trpcRouter = trpcRouterCreate({
  user: userRouter,
  schedule: scheduleRouter,
  booking: bookingRouter
});

export type TrpcRouter = typeof trpcRouter;
