import { trpcRouterCreate } from "src/domain/infra/trpcServerActions";
import { scheduleRouter } from "./scheduleRouter";
import userRouter from "./userRouter";

export const trpcRouter = trpcRouterCreate({
  users: userRouter,
  schedules: scheduleRouter,
});

export type TrpcRouter = typeof trpcRouter;
