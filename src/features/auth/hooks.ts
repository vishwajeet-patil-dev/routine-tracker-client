import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, requestOtp, verifyOtp } from "./api";

const profileKey = "profile";

export function useProfile() {
  return useQuery({
    queryKey: [profileKey],
    queryFn: getProfile,
  });
}

export function useRequestOtp() {
  return useMutation({ mutationFn: requestOtp });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [profileKey] }),
  });
}
