import { trpcRouterCreate } from "src/domain/infra/trpcServerActions";
import { scheduleRouter } from "./scheduleRouter";
import userRouter from "./userRouter";
import bookingRouter from "./bookingRouter";
import authRouter from "./authRouter";
import teacherRouter from "./teacherRouter";
import logsRouter from "./logsRouter";

export const trpcRouter = trpcRouterCreate({
  user: userRouter,
  schedule: scheduleRouter,
  booking: bookingRouter,
  auth: authRouter,
  teacher: teacherRouter,
  logs: logsRouter,
});

export type TrpcRouter = typeof trpcRouter;
