export type Appointment = {
  id: number;
  studentId?: number;
  createdAt: number;
  updatedAt: number;
} & AppointmentCreate;

export type AppointmentCreate = {
  teacherId: number;
  status: number;
  startDate: number;
  endDate: number;
};
