import { motion } from "motion/react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { confirmEmail, resendConfirmationCode } from "./service/userAdmin";
import { ArrowRight, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export default function VerifyEmail({ email, login }) {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Confirm email code
  const confirmCodeMutation = useMutation({
    mutationFn: (code) =>
      confirmEmail({
        code,
        email,
      }),
    onSuccess: () => {
        if(login){
            login()
        } else {
            navigate("/subscription-login");
        }
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  // Resend code
  const resendCodeMutation = useMutation({
    mutationFn: (email) =>
      resendConfirmationCode(email),
    onSuccess: () => {
      setCooldown(30); // start 30-second timer
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  // Countdown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown === 0 && !resendCodeMutation.isPending) {
      resendCodeMutation.mutate(email);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 max-w-md w-full bg-white rounded-4xl shadow-lg md:p-10 p-4 px-5"
    >
      <div className="text-center mb-6">
        <img
          className="mx-auto w-20 md:w-24 mb-3"
          src="/Logo.svg"
          alt="Title Munke Logo"
        />
        <h2 className="text-2xl font-semibold text-[#2c150f] mb-1">
          Enter code
        </h2>
        <p className="text-sm text-[#5b4636]">
          Please enter the code sent to your email.
        </p>

        <p className="text-sm text-[#5b4636] mt-3 flex items-center justify-center gap-2">
          Didn’t receive code?{" "}
          {cooldown > 0 ? (
            <span className="text-gray-400">
              Resend available in {cooldown}s
            </span>
          ) : resendCodeMutation.isPending ? (
            <span className="text-secondary flex items-center justify-center gap-1">
              <Loader size={14} className="animate-spin" /> Sending...
            </span>
          ) : (
            <span
              className="text-secondary cursor-pointer underline"
              onClick={handleResend}
            >
              Resend
            </span>
          )}
        </p>
      </div>

      <Input
        id="code"
        name="code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        placeholder="Enter code"
        className="mt-1 h-11 border-[#d5c3b5] bg-white text-[#2c150f] focus-visible:ring-0"
      />

      <Button
        type="submit"
        disabled={!code || confirmCodeMutation.isPending}
        className="mt-6 w-full"
        variant="secondary"
        onClick={() => confirmCodeMutation.mutate(code)}
      >
        {confirmCodeMutation.isPending ? (
          <>
            Verifying <Loader className="animate-spin ml-2" size={18} />
          </>
        ) : (
          <>
            Verify <ArrowRight size={18} className="ml-2" />
          </>
        )}
      </Button>

      {confirmCodeMutation.isError && (
        <p className="text-red-500 text-center text-sm font-medium mt-4">
          {confirmCodeMutation.error.response?.data?.error ||
            confirmCodeMutation.error.response?.data?.message ||
            "Something went wrong. Please try again."}
        </p>
      )}
    </motion.div>
  );
}
