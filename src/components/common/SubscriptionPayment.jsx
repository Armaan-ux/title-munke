import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/usercontext";
import ResetPassword from "../ResetPassword";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  CreditCard,
  Eye,
  EyeOff,
  Loader,
  UserRoundCheck,
} from "lucide-react";
import { motion } from "motion/react";
import VerifyEmail from "../verify-email";
import { useMutation } from "@tanstack/react-query";
import {
  confirmEmail,
  resendConfirmationCode,
  updateUserStatus,
} from "../service/userAdmin";
import { handleCreateAuditLog } from "@/utils";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PaymentDetailsModal } from "../Modal/PaymentDetailsModal";
import SubscriptionSuccessModal from "../Modal/SubscriptionSuccessModal";

function SubscriptionPayment() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, signIn } = useUser();
  const [isChecking, setIsChecking] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      user &&
      user.signInUserSession &&
      user.signInUserSession.idToken &&
      user.signInUserSession.idToken.payload &&
      user.signInUserSession.idToken.payload["cognito:groups"]
    ) {
      navigate(
        "/" + user.signInUserSession.idToken.payload["cognito:groups"][0],
      );
    }
  }, [user, navigate]);

  const submitHandler = () => {
    navigate("/subscription-card-details");
  };

  if (isReset) return <ResetPassword username={username} password={password} />;

  return (
    <>
      <PaymentDetailsModal
        open={showPaymentDetails}
        onOpenChange={(open) => setShowPaymentDetails(open)}
        onCancel={() => setShowPaymentDetails(false)}
      />

      <div className="relative min-h-dvh w-full overflow-hidden bg-[#2b140c]">
        {/* background */}
        <img
          src="/login-bg.jpg"
          alt="bg"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />

        {/* card wrapper */}
        <div className="relative z-10 mx-auto flex min-h-[978px] max-w-[970px] items-center justify-center px-4 py-10">
          <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl bg-[#fffaf3] shadow-2xl md:grid-cols-[30%_70%]">
            {/* LEFT */}
            <div className="hidden flex-col justify-center align-center bg-gradient-to-b from-[#FFFDFA] to-[#EDDDC0] p-10 md:flex">
              <div>
                <div className="flex  gap-3 flex-col">
                  <img src="/Logo.svg" className="h-40 w-40" alt="logo" />
                </div>

                <h2 className="mt-10 text-3xl font-semibold text-[#3b1f12]">
                  Welcome to
                  <br />
                  Title Munke
                </h2>
                <p className="mt-3 text-sm text-[#6b4a3a]">
                  Secure. Verified. Effortless
                </p>

                <ul className="mt-8 space-y-4 text-sm text-[#4a2b1a]">
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3b1f12] text-xs text-white">
                      ✓
                    </span>
                    Verified property network
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3b1f12] text-xs text-white">
                      ✓
                    </span>
                    Flexible access plans
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3b1f12] text-xs text-white">
                      ✓
                    </span>
                    Usage-based search
                  </li>
                </ul>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-center p-6 sm:p-10 bg-[url('/bg-signin.png')]">
              <div className="w-full max-w-lg ">
                {/* stepper */}
                <div className="flex items-center justify-center mb-5">
                  <div className="flex items-center rounded-full bg-[#f6efe6] px-2 py-1 shadow-sm">
                    {/* Active Step */}
                    <div className="flex items-center gap-2 rounded-full bg-gradient-to-l from-[#3D2014] to-[#550000] px-4 py-2 text-xs font-medium text-white">
                      <UserRoundCheck />
                      Info.
                    </div>

                    {/* Connector */}
                    <div className="mx-3 h-[2px] w-20 bg-[#BEA998]" />

                    {/* Inactive Step */}
                    <div className="flex items-center gap-2 rounded-full bg-gradient-to-l from-[#3D2014] to-[#550000] px-4 py-2 text-xs font-medium text-white">
                      <CreditCard />
                      Add Card
                    </div>
                  </div>
                </div>

                <div className="border-2 border-[#e6d6c3] rounded-3xl p-4 bg-[#FFFFFF] ">
                  <h3 className="text-2xl font-semibold text-[#3b1f12]">
                    Select Payment Method
                  </h3>
                  <p className="mt-1 text-sm text-[#7a5a49]">
                    choose your preferred payment method.
                  </p>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-6"></div>

                  {/* Total Payment Section */}
                  <div className="bg-amber-50 rounded-2xl p-5 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-[#3b1f12] mb-1">
                          Total Payment
                        </h3>
                        <button
                          onClick={() => setShowPaymentDetails(true)}
                          className="text-xs text-[#3b1f12] hover:text-gray-900 "
                        >
                          View Details
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-[#3b1f12]">
                          $0.00
                        </p>
                        <button
                          onClick={() => setShowPaymentDetails(true)}
                          className="text-xs text-[#550000] hover:text-red-700 underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3 mb-6">
                    <RadioGroup
                      //   value={selected}
                      //   onValueChange={setSelected}
                      className="space-y-3"
                    >
                      {/* Apple Pay Option */}
                      <Card className="flex flex-row items-center justify-between px-5 py-3 rounded-xl border hover:border-gray-400 transition">
                        <div className="flex items-center gap-3">
                          <img src="/apple-pay.svg" alt="apple pay" />
                          <span className="font-medium">Apple Pay</span>
                        </div>
                        <RadioGroupItem value="apple" />
                      </Card>
                      {/* Add Card Option */}
                      <Card className="flex flex-row items-center justify-between px-5 py-3 rounded-xl border hover:border-gray-400 transition">
                        <div className="flex items-center gap-3">
                          <img src="/card.svg" alt="card pay" />
                          <span className="font-medium">
                            {" "}
                            Add New Credit / Debit Card
                          </span>
                        </div>
                        <RadioGroupItem value="apple" />
                      </Card>
                    </RadioGroup>
                  </div>

                  {/* Skip Payment Link */}
                  <div className="text-center mb-8">
                    <button className="inline-flex items-center gap-2 text-sm font-medium text-[#550000] hover:text-secondary-700 underline">
                      Skip Payment Method
                      <ArrowRight />
                    </button>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                      <ArrowLeft /> Back
                    </button>

                    <button
                      onClick={submitHandler}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3
               bg-gradient-to-b from-[#3b1f12] to-[#5c2f1b]
               text-white rounded-xl font-medium transition-colors"
                    >
                      Make Payment <ArrowRight />
                    </button>
                  </div>
                  <div className="border-t border-gray-200 mb-6 mt-4"></div>
                  <p className="pt-4 text-center text-xs text-[#7a5a49]">
                    Already have an account?{" "}
                    <a
                      href="/subscription-login"
                      className="font-medium text-[#3b1f12] hover:underline"
                    >
                      Log In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubscriptionPayment;
