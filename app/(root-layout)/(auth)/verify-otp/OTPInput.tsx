"use client";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { sendConfirmEmail, verifyOtp } from "@/lib/actions/auth.actions";
import { useSession } from "@/store";
import { Alert, Box, Button, Center, PinInput, Text } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SearchParamsProvider } from "@/components/SearchParamsProvider";

// Inner component with search params logic
const OTPInputContent = () => {
  const router = useRouter();
  const { setSession, setUser } = useSession();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeResent, setCodeResent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const params = useSearchParams();
  const redirectPath = params.get("redirect");

  const verifyOTP = async () => {
    if (!otp) {
      setErrorMessage("Code is required");
      return;
    }

    setLoading(true);
    const { data, error } = await verifyOtp(otp, email);

    if (error) {
      setLoading(false);
      setErrorMessage("Invalid Code");
      return;
    }

    sessionStorage.removeItem("emailForOTP");

    if (redirectPath) {
      return router.push(redirectPath);
    }

    toast.success("Email has been verified");
    setSession(data.session);
    setUser(data.session?.user);
    router.push("/");
  };

  const resendCode = async () => {
    setLoading(true);
    const json = await sendConfirmEmail(email, "");

    if (json.error) {
      setLoading(false);
      return setErrorMessage("Error sending confirmation code");
    }

    toast.success("Confirmation code sent");
    setLoading(false);
    setCodeResent(true);
    setCountdown(60);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && codeResent) {
      setCodeResent(false);
    }

    return () => clearInterval(timer);
  }, [countdown, codeResent]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("emailForOTP");

    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <LoadingOverlay visible={loading} />
      <Center>
        <PinInput
          oneTimeCode
          length={6}
          type="number"
          value={otp}
          onChange={setOtp}
        />
      </Center>
      <Center pt="sm">
        <Button
          className="btn"
          miw={100}
          disabled={!otp || otp.length < 6}
          onClick={verifyOTP}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </Center>
      <Center pt="sm">
        <Text size="sm">Didn&apos;t receive the code?</Text>

        <Button
          onClick={resendCode}
          variant="transparent"
          disabled={codeResent}
        >
          Resend code {countdown > 0 && `(${countdown})`}
        </Button>
      </Center>
      {errorMessage && (
        <Alert variant="light" color="red" className="text-center">
          <p className="text-red-600">{errorMessage}</p>
        </Alert>
      )}
    </Box>
  );
};

// Wrapper component with Suspense boundary
export const OTPInput = () => {
  return (
    <SearchParamsProvider>
      <OTPInputContent />
    </SearchParamsProvider>
  );
};
