export type TrpcError =
  | "INTERNAL_SERVER_ERROR"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND";

export type TrpcErrorResponse = {
  errors: {
    message: string;
    title: string;
  }[];
};

export type TrpcSuccessResponse<T = any> = {
  data: T;
  errors: null;
};

export type TrpcResponse<T = any> = TrpcSuccessResponse<T> | TrpcErrorResponse;
