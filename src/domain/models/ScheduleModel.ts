export type Schedule = {
  id: number;
} & ScheduleCreate;

export type ScheduleCreate = {
  teacherId: number;
  day: number;
  start: number;
  end: number;
};
