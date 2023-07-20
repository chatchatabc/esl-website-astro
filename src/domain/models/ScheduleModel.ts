export type Schedule = {
  id: number;
  studentId?: number;

  createdAt: string;
  updatedAt: string;
} & ScheduleCreate;

export type ScheduleCreate = {
  teacherId: number;
  status: number;

  startDate: string;
  endDate: string;
};
