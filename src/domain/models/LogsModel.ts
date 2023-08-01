export type LogsCredit = {
  id?: number;
  senderId?: number;
  receiverId?: number;
  amount?: number;
  status?: number; // 0: pending, 1: accepted, 2: cancelled
  createdAt?: number;
  updatedAt?: number;

  title?: string;
};
