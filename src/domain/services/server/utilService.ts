import { TRPCError } from "@trpc/server";
import type { TrpcError } from "../../models/TrpcModel";

export function utilSuccessApiResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Allow-Access-Control-Origin": "*",
      "Allow-Access-Control-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Allow-Access-Control-Headers": "Content-Type",
      "Access-Control-Expose-Headers": "x-access-token",
    },
    status,
  });
}

export function utilFailedApiResponse(message: string, status: number = 500) {
  let title = "Internal Server Error";
  switch (status) {
    case 400:
      title = "Bad Request";
      break;
    case 401:
      title = "Unauthorized";
      break;
    case 403:
      title = "Forbidden";
      break;
    case 404:
      title = "Not Found";
      break;
  }

  return new Response(
    JSON.stringify({
      errors: [
        {
          title,
          message,
        },
      ],
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status,
    }
  );
}

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
