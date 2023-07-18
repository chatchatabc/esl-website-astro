import { TRPCError } from "@trpc/server";
import { TrpcError } from "../models/TrpcModel";

export function utilFailedResponse(message: string, status: number = 500) {
  let code: TrpcError = "INTERNAL_SERVER_ERROR";
  switch (status) {
    case 400:
      code = "BAD_REQUEST";
      break;
    case 401:
      code = "UNAUTHORIZED";
      break;
    case 403:
      code = "FORBIDDEN";
      break;
    case 404:
      code = "NOT_FOUND";
      break;
  }

  return new TRPCError({
    code,
    message,
  });
}
