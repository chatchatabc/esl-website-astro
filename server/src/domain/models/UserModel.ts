export type User = {
  username: string;
  password?: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;

  id: number;
  roleId: number;

  role?: UserRole;
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
