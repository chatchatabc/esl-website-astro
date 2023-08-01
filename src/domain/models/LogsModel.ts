export type LogsCredit = {
  id: number;
  createdAt: number;
  updatedAt: number;
} & LogsCreditCreate;

export type LogsCreditCreate = {
  senderId: number;
  receiverId: number;
  amount: number;
  status: number;

  title: string | null;
};
