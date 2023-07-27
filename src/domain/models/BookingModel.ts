import type { User } from "./UserModel";

export type Booking = {
  createdAt: number;
  updatedAt: number;

  student?: User;
} & BookingUpdate;

export type BookingUpdate = {
  id: number;
} & BookingCreate;

export type BookingCreate = {
  teacherId: number;
  status: number;
  start: number;
  end: number;
  studentId?: number;

  message?: string;
};
