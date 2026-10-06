import { useRef, useState } from "react";
import { useRequestOtp, useVerifyOtp } from "./hooks";
import { useNavigate } from "react-router";

const OTP_LENGTH = 6;

function Signin() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));

  const navigate = useNavigate();

  const requestMutation = useRequestOtp();
  const verifyMutation = useVerifyOtp();

  const handleContinue = async () => {
    if (step === 1) {
      requestMutation.mutate({ phoneNumber }, { onSuccess: () => setStep(2) });
    } else {
      verifyMutation.mutate(
        { phoneNumber, otp: otp.join("") },
        {
          onError: (error) => {
            console.error("Error verifying OTP:", error);
            setOtp(Array(OTP_LENGTH).fill(""));
          },
          onSuccess: (data) => {
            console.log("TOKEN:", data);

            localStorage.setItem("accessToken", data);

            console.log("STORED:", localStorage.getItem("accessToken"));

            navigate("/");
          },
        },
      );
    }
  };

  const handleBack = () => {
    verifyMutation.reset();
    requestMutation.reset();
    setStep(1);
  };

  return (
    <div className="h-dvh px-4 py-4 flex flex-col relative">
      {step === 1 ? (
        <NumberInput
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          handleContinue={handleContinue}
          disabled={requestMutation.isPending}
          error={requestMutation.error?.message}
        />
      ) : (
        <OTPInput
          handleBack={handleBack}
          phoneNumber={phoneNumber}
          otp={otp}
          setOtp={setOtp}
          handleContinue={handleContinue}
          disabled={verifyMutation.isPending}
          error={verifyMutation.error?.message}
        />
      )}
    </div>
  );
}

export default Signin;

function NumberInput({
  phoneNumber,
  setPhoneNumber,
  handleContinue,
  disabled,
  error,
}: {
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  handleContinue: () => void;
  disabled: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-8 p-4 absolute w-full top-[40%] left-0 translate-y-[-50%]">
      <div className="">
        <p className="mb-2 text-text-muted font-medium text-[14px]">Step 1</p>
        <h2 className="text-text font-semibold text-2xl">Sign in</h2>
        <p className="text-[14px] w-[70%] text-text-secondary leading-[18px] mt-1">
          We will text you a code to verify your number.
        </p>
      </div>
      <div className=" flex flex-col gap-2">
        <p className="text-[14px] font-medium text-text-secondary">
          Mobile number
        </p>
        <div className="text-xl font-semibold flex gap-2">
          <p className="text-text">+91</p>
          <input
            type="tel"
            inputMode="numeric"
            className="text-text-secondary focus:outline-none"
            value={phoneNumber}
            onChange={(e) => {
              // e.target.value
              setPhoneNumber(e.target.value);
            }}
          />
        </div>
        <hr className="mt-2 bg-border" />
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleContinue}
          disabled={disabled || phoneNumber.length !== 10}
          className="w-full py-4 rounded-xl bg-text text-white font-semibold text-sm disabled:bg-surface"
        >
          Continue
        </button>
        {error ? <p className="text-xs text-red-500 ">{error}</p> : null}
        <p className="text-text-muted text-[12px] font-[200]">
          By continuing you agree to the terms and privacy policy.
        </p>
      </div>
    </div>
  );
}

function OTPInput({
  handleBack,
  phoneNumber,
  otp,
  setOtp,
  handleContinue,
  disabled,
  error,
}: {
  handleBack: () => void;
  phoneNumber: string;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  handleContinue: () => void;
  disabled: boolean;
  error?: string;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const handleChange = (index: number, value: string) => {
    // Keep only numbers
    const digits = value.replace(/\D/g, "");

    // Handle OTP autofill / paste
    if (digits.length > 1) {
      const nextOtp = [...otp];

      digits
        .slice(0, OTP_LENGTH - index)
        .split("")
        .forEach((digit, offset) => {
          nextOtp[index + offset] = digit;
        });

      setOtp(nextOtp);

      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);

      focusInput(nextIndex);
      return;
    }

    // Empty value
    if (!digits) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });

      return;
    }

    // Single digit
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digits;
      return next;
    });

    // Move to next input
    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    switch (e.key) {
      case "Backspace": {
        if (otp[index]) {
          // Current box has value → just clear it
          setOtp((prev) => {
            const next = [...prev];
            next[index] = "";
            return next;
          });
        } else if (index > 0) {
          // Current box empty → move back and clear previous
          setOtp((prev) => {
            const next = [...prev];
            next[index - 1] = "";
            return next;
          });

          focusInput(index - 1);
        }

        e.preventDefault();
        break;
      }

      case "ArrowLeft": {
        if (index > 0) {
          focusInput(index - 1);
        }

        e.preventDefault();
        break;
      }

      case "ArrowRight": {
        if (index < OTP_LENGTH - 1) {
          focusInput(index + 1);
        }

        e.preventDefault();
        break;
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!digits) return;

    const nextOtp = Array(OTP_LENGTH).fill("");

    digits.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);

    focusInput(Math.min(digits.length, OTP_LENGTH - 1));
  };

  const isComplete = otp.every(Boolean);

  return (
    <div className=" flex flex-col gap-8 p-4 absolute w-full top-[40%] left-0 translate-y-[-50%]">
      <div className="">
        <p
          onClick={handleBack}
          className="mb-2 flex items-center gap-1 text-text-muted font-medium text-[14px]"
        >
          <BackIcon /> Step 2
        </p>
        <h2 className="text-text font-semibold text-2xl mt-6">
          Enter the code
        </h2>
        <p className="text-[14px] text-text-secondary mt-1">
          Sent to +91 {phoneNumber}
        </p>
      </div>
      <div className="flex justify-around gap-2">
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="focus:outline-none h-[60px] w-[50px] border-b-2 border-border-strong text-4xl text-text-secondary text-center font-semibold"
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <button
          disabled={disabled || !isComplete}
          onClick={handleContinue}
          className="w-full py-4 rounded-xl bg-text text-white font-semibold text-sm disabled:bg-surface"
        >
          Continue
        </button>
        {error ? <p className="text-xs text-red-500 ">{error}</p> : null}
        <p className="text-text-muted text-[12px] font-[200]">
          By continuing you agree to the terms and privacy policy.
        </p>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-arrow-left preview-icon"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M29 12H5" />
    </svg>
  );
}
