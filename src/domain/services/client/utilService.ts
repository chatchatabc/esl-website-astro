import { TRPCClientError } from "@trpc/client";

export function utilHandleTrpcError(error: any) {
  if (error instanceof TRPCClientError) {
    return {
      errors: [
        {
          message: error.message,
          title: "Error",
        },
      ],
    };
  }

  return {
    errors: [
      {
        message: "Unknown error",
        title: "Error",
      },
    ],
  };
}
