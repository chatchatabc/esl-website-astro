export type Schedule = {
  id: number;
  studentId?: number;
  createdAt: number;
  updatedAt: number;
} & ScheduleCreate;

export type ScheduleCreate = {
  teacherId: number;
  status: number;
  startDate: number;
  endDate: number;
};
