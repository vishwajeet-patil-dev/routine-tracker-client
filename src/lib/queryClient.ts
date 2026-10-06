import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./http";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (failureCount, error) => {
        // 4xx = our request is the problem; retrying can't fix it
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 2; // server/network problems: retry up to 2 times
      },
    },
  },
});
