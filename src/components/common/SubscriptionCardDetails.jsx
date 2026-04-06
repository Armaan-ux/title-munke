import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/usercontext";
import { CreditCard, UserRoundCheck } from "lucide-react";
import SubscriptionSuccessModal from "../Modal/SubscriptionSuccessModal";
import CardAddedSuccessModal from "../Modal/CardAddedSuccessModal";
import PaymentSetup from "../stripe/payment-form";
import { useUserIdType } from "@/hooks/useUserIdType";
import { createAgentfromSignup } from "../service/userAdmin";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { saveSubscriptionData, clearSubscriptionData } from "@/utils/subscriptionStorage";

function SubscriptionCardDetails({ isAddCard = false }) {
  const { planId } = useParams();
  const { user, signIn } = useUser();
  const { userType } = useUserIdType();
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
  const [showCardSuccess, setShowCardSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const getStoredAgents = () =>
    JSON.parse(localStorage.getItem("invitedAgents")) || [];
  const getStoredBrokers = () =>
    JSON.parse(localStorage.getItem("invitedBroker")) || [];

  const getStoredOrgAgents = () =>
    JSON.parse(localStorage.getItem("invitedOrgAgents")) || [];

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("isPaymentSuccessful") === "true") {
      setShowSubscriptionSuccess(true);
    }

    if (params.get("isCardAdded") === "true") {
      setShowCardSuccess(true);
    }
  }, [location.search]);

  const handlePaymentSuccess = () => {
    if (userType === "broker" && planId !== "EXPLORE_PLAN") {
      addAgentsBatchMutation.mutate();
    }
    if (userType === "organisation" && planId !== "EXPLORE_PLAN") {
      addOrganisationBatchMutation.mutate();
    }
    if (planId === "PAY_AS_YOU_GO") {
      setShowCardSuccess(true);
    } else {
      setShowSubscriptionSuccess(true);
    }
  };

  useEffect(() => {
    saveSubscriptionData({}, window.location.pathname);
  }, []);

  const subscribeModalHandler = () => {
    setIsLoading(true);
    clearSubscriptionData(); // Clear data on final success

    setTimeout(() => {
      setIsLoading(false);
      setShowSubscriptionSuccess(false);
      setShowCardSuccess(false);
      navigate(
        "/" + user.signInUserSession.idToken.payload["cognito:groups"][0],
      );
      toast.success("login successfully");
    }, 2000);
  };

  const addAgentsBatchMutation = useMutation({
    mutationFn: async () => {
      const agents = getStoredAgents();

      if (!agents.length) return;

      await Promise.all(
        agents.map((agent) =>
          createAgentfromSignup({
            name: agent.name,
            email: agent.email,
            phoneNumber: agent.phoneNumber,
            searchLimit: agent.searchLimit,
            userType: agent.userType,
            brokerId: agent?.brokerId,
            planType: agent?.planType,
          }),
        ),
      );
    },
    onSuccess: () => {
      localStorage.removeItem("invitedAgents");
    },
    onError: (error) => {
      console.error("Batch error", error);
      // setError("Failed to add agents");
    },
  });

  const addOrganisationBatchMutation = useMutation({
    mutationFn: async () => {
      const brokers = getStoredBrokers();
      const agents = getStoredOrgAgents();

      if (!brokers.length && !agents.length) return;

      const brokerIdMap = {}; // UUID → real brokerId

      try {
        //  Create Brokers First (if any)
        if (brokers.length) {
          await Promise.all(
            brokers.map(async (broker) => {
              const res = await createAgentfromSignup({
                name: broker.name,
                email: broker.email,
                phoneNumber: broker.phoneNumber,
                userType: "broker",
                organisationId: broker.organisationId,
                planType: broker.planType,
                actionType: "register_broker_from_org",
                customUUID: broker?.customUUID,
              });

              const realId = res?.user?.id;
              const responseUUID = res?.user?.customUUID;

              if (responseUUID && realId) {
                brokerIdMap[responseUUID] = realId;
              }
            }),
          );
        }

        //  Prepare Agents (only if exist)
        if (agents.length) {
          const updatedAgents = agents.map((agent) => {
            const mappedBrokerId = brokerIdMap[agent.brokerId];

            return {
              ...agent,
              brokerId: mappedBrokerId || agent.brokerId,
            };
          });

          //  Only validate mapping if brokers were created
          if (brokers.length) {
            const invalidAgent = updatedAgents.find(
              (a) => !a.brokerId || a.brokerId.length < 10,
            );
            if (invalidAgent) {
              throw new Error(
                "Invalid brokerId mapping. Aborting agent creation.",
              );
            }
          }

          //  Create Agents
          await Promise.all(
            updatedAgents.map((agent) =>
              createAgentfromSignup({
                name: agent.name,
                email: agent.email,
                phoneNumber: agent.phoneNumber,
                searchLimit: agent.searchLimit,
                userType: "agent",
                brokerId: agent.brokerId,
                planType: agent.planType,
                organisationId: agent?.organisationId,
              }),
            ),
          );
        }
      } catch (error) {
        console.error("Organisation batch failed:", error);
        throw error;
      }
    },

    onSuccess: () => {
      localStorage.removeItem("invitedBroker");
      localStorage.removeItem("invitedOrgAgents");
    },

    onError: (error) => {
      console.error("Batch failed. Nothing removed.", error);
    },
  });

  return (
    <>
      <SubscriptionSuccessModal
        open={showSubscriptionSuccess}
        onOpenChange={subscribeModalHandler}
        onFailed={() => {}}
        isLoading={
          addAgentsBatchMutation?.isPending ||
          addOrganisationBatchMutation?.isPending ||
          isLoading
        }
        showCloseIcon={false}
        planId={planId}
      />
      <CardAddedSuccessModal
        open={showCardSuccess}
        onOpenChange={subscribeModalHandler}
        isLoading={
          addAgentsBatchMutation?.isPending ||
          addOrganisationBatchMutation?.isPending ||
          isLoading
        }
        showCloseIcon={false}
        fromSignUp={true}
        onFailed={() => {}}
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
            <div className="flex items-center justify-center p-6 sm:p-10 bg-[url('/bg-signin.png')] md:pb-[200px]">
              <div className="w-full max-w-lg ">
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
                      <div className="flex items-center gap-2 rounded-full bg-[#3b1f12] px-4 py-2 text-xs font-medium text-white justify-center">
                        <CreditCard />
                        Add Card
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-2 border-[#e6d6c3] rounded-3xl p-4 bg-[#FFFFFF]">
                  {/* <form className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm text-[#3b1f12]">
                        Enter Card Details
                      </label>
                      <input
                        className="mt-1 w-full rounded-md border border-[#e6d6c3] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#3b1f12]"
                        placeholder="Name on Card"
                      />
                    </div>
                    <div>
                      <input
                        className="mt-1 w-full rounded-md border border-[#e6d6c3] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#3b1f12]"
                        placeholder="Card Number"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="relative">
                        <div className="flex items-center">
                          <input
                            type="text"
                            className="mt-1 w-full rounded-md border border-[#e6d6c3] bg-transparent mb-1 px-3 py-2 pr-10 text-sm outline-none focus:border-[#3b1f12]"
                            placeholder="MM/YY"
                          />
                          <div className="absolute right-3 bottom-[14px] cursor-pointer m-0 p-0 px-0 h-auto w-auto">
                            <img src="./calendar.png" alt="calander" />
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="flex items-center">
                          <input
                            type="text"
                            className="mt-1 w-full rounded-md border border-[#e6d6c3] bg-transparent mb-1 px-3 py-2 pr-10 text-sm outline-none focus:border-[#3b1f12]"
                            placeholder="cvv"
                          />
                          <div className="absolute right-3 bottom-[14px] cursor-pointer m-0 p-0 px-0 h-auto w-auto">
                            <img src="./cvv.png" alt="calander" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <input
                        className="mt-1 w-full rounded-md border border-[#e6d6c3] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#3b1f12]"
                        placeholder="ZIP Code"
                      />
                    </div>
                    <div className="flex items-start  gap-2 mb-10 ">
                      <input
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 rounded border-[#d8c3ab] text-[#3b1f12] focus:ring-[#3b1f12]"
                        onClick={(e) => {
                          if (e.target.checked) {
                            setShowCardSuccess(true);
                          } else {
                            setShowCardSuccess(false);
                          }
                        }}
                      />
                      <label htmlFor="terms" className="text-sm text-[#3b1f12]">
                        Save Card information
                      </label>
                    </div>

                 
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                        <ArrowLeft /> Back
                      </button>

                      <button
                        onClick={paymentHandler}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3
               bg-gradient-to-b from-[#3b1f12] to-[#5c2f1b]
               text-white rounded-xl font-medium transition-colors"
                      >
                        Make Payment <ArrowRight />
                      </button>
                    </div>
               
                  </form> */}
                  <PaymentSetup
                    isAddCard={isAddCard}
                    planId={planId}
                    onPaymentSuccess={handlePaymentSuccess}
                    actionType="coming_from_register"
                  />

                  <div className="border-t border-gray-200 mb-6 mt-4"></div>
                  <p className="text-center text-xs text-[#7a5a49]">
                    Already have an account?{" "}
                    <a
                      href="/subscription-payment"
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

export default SubscriptionCardDetails;
