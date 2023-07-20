export type Schedule = {
  id: number;
  teacherId: number;
  studentId?: number;
  status: number;

  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};
