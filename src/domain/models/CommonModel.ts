export type CommonContent<T = any> = {
  content: T[];
  page: number;
  size: number;
  total: number;
};

export type CommonParams = {
  page: number;
  size: number;
  keyword?: string;
} & (
  | {
      sortField: string;
      sortValue: "asc" | "desc";
    }
  | {
      sortField: null;
      sortValue: null;
    }
);
