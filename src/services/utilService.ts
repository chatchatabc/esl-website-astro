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

export function utilCookieSave(
  name: string,
  value: any,
  maxAge: number = 3600
) {
  value = JSON.stringify(value);
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

export function utilCookieGet(name: string) {
  const cookie = document.cookie;
  const value = cookie
    .split("; ")
    .find((item) => item.includes(`${name}=`))
    ?.trim()
    .slice(name.length + 1);

  if (!value) {
    return undefined;
  }

  return JSON.parse(value);
}
