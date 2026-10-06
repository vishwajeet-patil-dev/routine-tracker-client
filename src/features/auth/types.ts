export type RequestOtpInput = {
  phoneNumber: string;
};

export type VerifyOtpInput = {
  phoneNumber: string;
  otp: string;
};

export type User = {
  phoneNumber: string;
  name?: string;
};
