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

export function utilValidOrigin(origin: string) {
  const allowedOrigin = [
    "http://localhost:3000",
    "https://esl-cca.pages.dev",
    "https://trpc.esl-cca.pages.dev",
    "https://dev.esl-cca.pages.dev",
  ];

  if (allowedOrigin.includes(origin)) {
    return true;
  }

  return false;
}
