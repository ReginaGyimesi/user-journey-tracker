import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const useApiError = (error: FetchBaseQueryError | undefined): string => {
  if (!error) return "";

  if ("data" in error) {
    const errorData = error.data as any;
    return errorData?.message || "An error occurred";
  }

  if ("status" in error) {
    return `Error ${error.status}: ${error.statusText || "An error occurred"}`;
  }

  return "An error occurred";
};
