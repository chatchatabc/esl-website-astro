import { trpcRouterCreate } from "src/domain/infra/trpcServerActions";
import { scheduleRouter } from "./scheduleRouter";
import userRouter from "./userRouter";

export const trpcRouter = trpcRouterCreate({
  user: userRouter,
  schedule: scheduleRouter,
});

export type TrpcRouter = typeof trpcRouter;
