import type { Teacher } from "./TeacherModel";

export type User = {
  username: string;
  password?: string;

  id: number;
  roleId: number;
  createdAt: number;
  updatedAt: number;
  credit: number;

  role?: UserRole;
  teacher?: Teacher;
} & UserPersonalInformation &
  UserContactInformation &
  UserContactValidation;

export type UserPersonalInformation = {
  firstName?: string | null;
  lastName?: string | null;
};

export type UserContactInformation = {
  phone?: string | null;
  email?: string | null;
};

export type UserContactValidation = {
  phoneVerifiedAt?: number | null;
  emailVerifiedAt?: number | null;
};

export type UserRole = {
  name: string;
  createdAt: string;
  updatedAt: string;

  id: number;
};

export type UserRegister = {
  roleId: number;
} & UserRegisterInput;

export type UserRegisterInput = {
  username: string;
  password: string;
  confirmPassword: string;
};

export type UserLogin = {
  username: string;
  password: string;
};
