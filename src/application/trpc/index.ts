import { trpcRouterCreate } from "src/domain/infra/trpcServerActions";
import { scheduleRouter } from "./scheduleRouter";
import userRouter from "./userRouter";
import bookingRouter from "./bookingRouter";
import authRouter from "./authRouter";

export const trpcRouter = trpcRouterCreate({
  user: userRouter,
  schedule: scheduleRouter,
  booking: bookingRouter,
  auth: authRouter,
});

export type TrpcRouter = typeof trpcRouter;
