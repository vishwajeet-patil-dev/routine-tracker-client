import { api } from "../../lib/http";
import type { ApiResponse } from "../../lib/types";
import type { RequestOtpInput, User, VerifyOtpInput } from "./types";

export async function getProfile(): Promise<User> {
  const { data } = await api.get<ApiResponse<User>>("/profile");
  return data;
}
export async function requestOtp(input: RequestOtpInput): Promise<void> {
  await api.post<{ message: string }>("/request-otp", input);
}
export async function verifyOtp(input: VerifyOtpInput): Promise<string> {
  const { data } = await api.post<{
    message: string;
    data: {
      accessToken: string;
    };
  }>("/verify-otp", input);

  return data.accessToken;
}
