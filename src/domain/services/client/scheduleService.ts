import { trpcClient } from "src/domain/infra/trpcClientActions";
import type { Schedule } from "src/domain/models/ScheduleModel";

export async function scheduleGetAllByUser(params: { userId: number }) {
  try {
    const response = await trpcClient.schedule.getAllByUser.query(params);
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function scheduleUpdateMany(params: {
  userId: number;
  schedules: Schedule[];
}) {
  try {
    const response = await trpcClient.schedule.updateManyByTeacher.mutate(
      params
    );
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
