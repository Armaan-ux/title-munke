import { useEffect, useState } from "react";
import { saveSubscriptionData } from "@/utils/subscriptionStorage";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/usercontext";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  UserRoundCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PaymentDetailsModal } from "../Modal/PaymentDetailsModal";
import { toast } from "react-toastify";
import { useUserIdType } from "@/hooks/useUserIdType";

function SubscriptionPayment() {
  const navigate = useNavigate();
  const { planId } = useParams();
  const { user, setUser, signIn } = useUser();
  const { userType } = useUserIdType();
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    saveSubscriptionData({}, window.location.pathname);
  }, []);
  const getStoredAgents = () =>
    JSON.parse(localStorage.getItem("invitedAgents")) || [];
  const getStoredBrokers = () =>
    JSON.parse(localStorage.getItem("invitedBroker")) || [];

  const getStoredOrgAgents = () =>
    JSON.parse(localStorage.getItem("invitedOrgAgents")) || [];
  const agents = getStoredAgents();
  const brokers = getStoredBrokers();
  const orgAgents = getStoredOrgAgents();
  const agentCount =
    userType === "broker"
      ? (agents?.length ?? 0)
      : userType === "organisation"
        ? (orgAgents?.length ?? 0) + (brokers?.length ?? 0)
        : 0;
  const price = localStorage.getItem("price") || "$0.00";
  const numericPrice = Number(price.replace("$", ""));
  const seatFees = numericPrice * agentCount;
  const tax = 0;
  const totalAmount = numericPrice + tax + seatFees;

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("paymentMethod", paymentMethod);
    // debugger;
    if (paymentMethod === "card") {
      // setUser(pre => ({...pre, isAddCard: true}))
      navigate(`/subscription-card-details/${planId}`);
      return;
    }
    toast.error("Please select a payment method to proceed.", {
      autoClose: 3000,
    });
    return;
  };

  // if (isReset) return <ResetPassword username={username} password={password} />;

  const skipPaymentHandler = () => {
    navigate("/" + user.signInUserSession.idToken.payload["cognito:groups"][0]);
  };
  return (
    <>
      <PaymentDetailsModal
        open={showPaymentDetails}
        onOpenChange={(open) => setShowPaymentDetails(open)}
        onCancel={() => setShowPaymentDetails(false)}
        price={price}
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

                <p className="mt-10 text-3xl font-semibold text-[#3b1f12]">
                  Welcome to
                  <br />
                  Title Munke
                </p>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.4 }}
              className="flex items-center justify-center p-6 sm:p-10 bg-[url('/bg-signin.png')]"
            >
              <div className="w-full max-w-lg">
                {/* stepper */}
                {userType === "broker" || userType === "organisation" ? (
                  <div className="flex items-center justify-center mb-5">
                    <div className="flex items-center rounded-full bg-[#f6efe6] px-2 py-1 shadow-sm">
                      {/* Active Step */}
                      <div className="flex items-center gap-2 rounded-full bg-[#3b1f12] px-4 py-2 text-xs font-medium text-white">
                        <UserRoundCheck />
                        Info.
                      </div>

                      {/* Connector */}
                      <div className="mx-3 h-[2px] w-12 bg-[#3b1f12]" />
                      {/* Active Step */}
                      <div className="flex items-center gap-2 rounded-full bg-[#3b1f12] px-4  py-2 text-xs font-medium text-white justify-center">
                        <UserRoundCheck />
                        Add User
                      </div>

                      {/* Connector */}
                      <div className="mx-3 h-[2px] w-12 bg-[#3b1f12]" />

                      {/* Active Step */}
                      <div className="flex items-center gap-2 rounded-full bg-[#3b1f12] px-4  py-2 text-xs font-medium text-white justify-center">
                        <CreditCard />
                        Add Card
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center mb-5">
                    <div className="flex items-center rounded-full bg-[#f6efe6] px-2 py-1 shadow-sm">
                      {/* Active Step */}
                      <div className="flex items-center gap-2 rounded-full bg-gradient-to-l from-[#3D2014] to-[#550000] px-4 py-2 text-xs font-medium text-white">
                        <UserRoundCheck />
                        Info.
                      </div>

                      {/* Connector */}
                      <div className="mx-3 h-[2px] w-20 bg-[#3b1f12]" />

                      {/* Active Step */}
                      <div className="flex items-center gap-2 rounded-full bg-[#3b1f12] px-4  py-2 text-xs font-medium text-white justify-center">
                        <CreditCard />
                        Add Card
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-2 border-[#e6d6c3] rounded-3xl p-4 bg-[#FFFFFF] ">
                  <p className="text-2xl font-semibold text-[#3b1f12]">
                    Select Payment Method
                  </p>
                  <p className="mt-1 text-sm text-[#7a5a49]">
                    choose your preferred payment method.
                  </p>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-6"></div>

                  {/* Total Payment Section */}
                  {planId === "PROFESSIONAL_PLAN" && (
                    <div className="bg-amber-50 rounded-2xl p-5 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-semibold text-[#3b1f12] mb-1">
                            Total Payment
                          </p>
                          <button
                            onClick={() => setShowPaymentDetails(true)}
                            className="text-xs text-[#3b1f12] hover:text-gray-900 "
                          >
                            View Details
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-semibold text-[#3b1f12]">
                            {price ? `$${totalAmount.toFixed(2)}` : `$0.00`}
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
                  )}

                  {/* Payment Options */}
                  <div className="space-y-3 mb-6">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      {/* Apple Pay Option */}
                      <Card
                        className={`flex flex-row items-center justify-between px-5 py-3 rounded-xl border transition cursor-pointer ${paymentMethod === "apple" ? "border-[#3b1f12] bg-[#f6efe6]" : "hover:border-gray-400"}`}
                        onClick={() => setPaymentMethod("apple")}
                      >
                        <div className="flex items-center gap-3">
                          <img src="/apple-pay.svg" alt="apple pay" />
                          <span className="font-medium">Apple Pay</span>
                        </div>
                        <RadioGroupItem value="apple" />
                      </Card>
                      {/* Add Card Option */}
                      <Card
                        className={`flex flex-row items-center justify-between px-5 py-3 rounded-xl border transition cursor-pointer ${paymentMethod === "card" ? "border-[#3b1f12] bg-[#f6efe6]" : "hover:border-gray-400"}`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <div className="flex items-center gap-3">
                          <img src="/card.svg" alt="card pay" />
                          <span className="font-medium">
                            {" "}
                            Add New Credit / Debit Card
                          </span>
                        </div>
                        <RadioGroupItem value="card" />
                      </Card>
                    </RadioGroup>
                  </div>

                  {/* Skip Payment Link */}
                  {planId === "EXPLORE_PLAN" && (
                    <div className="text-center mb-8" type="button">
                      <button
                        onClick={skipPaymentHandler}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#550000] hover:text-secondary-700 underline"
                      >
                        Skip Payment Method
                        <ArrowRight />
                      </button>
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={() => navigate(-1)}
                      type="button"
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft /> Back
                    </button>

                    <button
                      type="button"
                      disabled={planId === "EXPLORE_PLAN"}
                      onClick={submitHandler}
                      className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3
                         bg-gradient-to-b from-[#3b1f12] to-[#5c2f1b]
               text-white rounded-xl font-medium transition-colors ${planId === "EXPLORE_PLAN" ? "disabled:opacity-50 disabled:cursor-not-allowed" : "hover:bg-gradient-to-t from-[#3b1f12] to-[#5c2f1b]"}`}
                    >
                      Make Payment <ArrowRight />
                    </button>
                  </div>
                  <div className="border-t border-gray-200 mb-6 mt-4"></div>
                  {/* <p className="pt-4 text-center text-xs text-[#7a5a49]">
                    Already have an account?{" "}
                    <a
                      href="/subscription-login"
                      className="font-medium text-[#3b1f12] hover:underline"
                    >
                      Log In
                    </a>
                  </p> */}
                  <div className="text-center my-4 text-sm">
                    <span>Don't have an account? </span>
                    <Link to="/" className="text-secondary">
                      Register Now
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubscriptionPayment;
