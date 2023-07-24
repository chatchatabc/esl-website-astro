export type Schedule = {
  id: number;
} & ScheduleCreate;

export type ScheduleCreate = {
  teacherId: number;
  day: number;
} & ScheduleTime;

export type ScheduleDayAndUser = {
  day: number;
  userId: number;
};

export type ScheduleTime = {
  startTime: number;
  endTime: number;
};
