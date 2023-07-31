import type { Teacher } from "./TeacherModel";

export type User = {
  username: string;
  password?: string;

  id: number;
  roleId: number;
  createdAt: number;
  updatedAt: number;

  role?: UserRole;
  teacher?: Teacher;
} & UserPersonalInformation &
  UserContactInformation &
  UserContactValidation;

export type UserPersonalInformation = {
  firstName: string | null;
  lastName: string | null;
};

export type UserContactInformation = {
  phone: string | null;
  email?: string | null;
};

export type UserContactValidation = {
  phoneVerifiedAt: number | null;
  emailVerifiedAt: number | null;
};

export type UserRole = {
  name: string;
  createdAt: string;
  updatedAt: string;

  id: number;
};

export type UserRegister = {
  username: string;
  password: string;
  confirmPassword: string;

  role: number;
};

export type UserLogin = {
  username: string;
  password: string;
};
