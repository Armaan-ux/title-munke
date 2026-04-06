import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  CreditCard,
  UserRoundCheck,
  Loader,
  Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { checkEmailExist, getBrokerAndOrganizationSelectListing } from "../service/userAdmin";
import { Label } from "../ui/label";
import { motion } from "motion/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { addOrgAgentSchema } from "@/formSchema";
import { useUserIdType } from "@/hooks/useUserIdType";
import AgentAddedSuccessModal from "../Modal/AgentAddedSuccessModal";
import { formatUSPhone } from "@/utils/date";
import { useUser } from "@/context/usercontext";
import { saveSubscriptionData } from "@/utils/subscriptionStorage";
function SubscriptionAddOrdAgent() {
  const navigate = useNavigate();
  const { planId } = useParams();
  const { organisationDetail, user } = useUser();
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [lastAddedBrokerName, setLastAddedBrokerName] = useState("");
  const [addBroker, setAddBroker] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { userType, userId } = useUserIdType();

  useEffect(() => {
    saveSubscriptionData({}, window.location.pathname);
  }, []);

  const invitedBrokers =
    JSON.parse(localStorage.getItem("invitedBroker")) || [];
  console.log("userType", userType);

  const brokerOrgListQuery = useQuery({
    queryKey: ["brokerOrgList"],
    queryFn: () =>
      getBrokerAndOrganizationSelectListing("fetch_broker_listing_for_org"),
    enabled: userId && userType === "organisation",
  });

  const brokerAndOrganizationList = brokerOrgListQuery?.data?.data ?? [];

  const invitedBrokerOptions = invitedBrokers.map((item) => ({
    label: item.name,
    value: item.customUUID,
    email: item.email,
    isInvited: true,
  }));

  // const apiOptions = useMemo(
  //   () =>
  //     (brokerAndOrganizationList || []).map((item) => ({
  //       label: item.name,
  //       value: item.id,
  //       email: item.email,
  //       isInvited: false,
  //     })),
  //   [brokerAndOrganizationList],
  // );
  const dropdownOptions = useMemo(() => {
    // const merged = [...apiOptions];
    const merged = [];

    invitedBrokerOptions.forEach((invited) => {
      const exists = merged.some((opt) => opt.email === invited.email);
      if (!exists) merged.push(invited);
    });

    return merged;
  }, [invitedBrokerOptions]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addOrgAgentSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      selectedBroker: "",
    },
  });
  const phoneValue = watch("phoneNumber");

  const emailExistMutation = useMutation({
    mutationFn: (email) =>
      checkEmailExist({
        email: email?.trim(),
      }),
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    setIsLoading(true);

    try {
      const res = await emailExistMutation.mutateAsync(data?.email);

      if (res?.emailExists) {
        setError("This email already exists.");
        setIsLoading(false);
        return;
      }
      const existingOrgAgent =
        JSON.parse(localStorage.getItem("invitedOrgAgents")) || [];

      const email = data?.email?.toLowerCase();
      const userEmail = user?.attributes?.email?.toLowerCase();

      const isDuplicate =
        existingOrgAgent.some(
          (agent) => agent?.email?.toLowerCase() === email,
        ) || email === userEmail;

      if (isDuplicate) {
        setError("This email already exists.");
        setIsLoading(false);
        return;
      }
      const newOrgAgent = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        brokerId: data.selectedBroker,
        planType: planId,
        userType: "agent",
        organisationId: organisationDetail?.id,
      };

      // Add new agent
      const updatedOrgAgents = [...existingOrgAgent, newOrgAgent];

      // Save back to localStorage
      localStorage.setItem(
        "invitedOrgAgents",
        JSON.stringify(updatedOrgAgents),
      );

      setLastAddedBrokerName(data.name);
      console.log("Saved org agents:", updatedOrgAgents);
      reset();
      // Show success modal
      setAddBroker(true);
    } catch (error) {
      console.log("error", error);
    }
    setIsLoading(false);
  };

  // Countdown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  // if (isReset) return <ResetPassword username={username} password={password} />;
  const handleContinue = () => {
    navigate(`/subscription-payment/${planId}`);
  };
  const handleSkip = () => {
    navigate(`/subscription-payment/${planId}`);
  };

  const handleAddAgent = () => {
    setAddBroker(false);
  };
  return (
    <>
      <AgentAddedSuccessModal
        open={addBroker}
        onOpenChange={setAddBroker}
        onAddAgent={handleAddAgent}
        onContinue={handleContinue}
        agentName={lastAddedBrokerName}
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
            <div className="hidden flex-col  justify-center align-center bg-gradient-to-b from-[#FFFDFA] to-[#EDDDC0] p-10 md:flex">
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
              <div className="w-full max-w-lg ">
                {/* stepper */}
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
                    <div className="mx-3 h-[2px] w-12 bg-[#BEA998]" />

                    {/* Inactive Step */}
                    <div className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[#7a5a49]">
                      <CreditCard />
                      Add Card
                    </div>
                  </div>
                </div>

                <div className="border-2 border-[#e6d6c3] rounded-3xl p-4 bg-[#FFFFFF] ">
                  {planId === "EXPLORE_PLAN" ? (
                    <div className="display flex flex-col items-center justify-center gap-6 h-full text-center py-60">
                      <Lock size={40} color="#3D2014" />
                      <Button
                        onClick={handleContinue}
                        className="mt-4 flex  items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#3b1f12] to-[#5c2f1b] px-4 py-2 text-sm font-medium text-white"
                      >
                        Skip for now
                        <ArrowRight size={18} />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {/* <p className="text-2xl font-semibold text-[#3b1f12]">
                        Add Agent
                      </p>
                      <p className="mt-1 text-sm text-[#7a5a49]">
                        Start your secure onboarding.
                      </p> */}
                      <div className="flex items-center justify-center mb-5">
                        <div className="flex items-center rounded-full bg-[#f6efe6] px-2 py-1 shadow-sm">
                          {/* Active Step */}
                          <div className="flex items-center gap-2 rounded-full bg-[#3b1f12] px-4 py-2 text-xs font-medium text-white">
                            <UserRoundCheck />
                            Broker
                          </div>
                          {/* Connector */}
                          <div className="mx-3 h-[2px] w-12 bg-[#3b1f12]" />

                          {/* Inactive Step */}
                          <div className="flex items-center gap-2 rounded-full bg-[#3b1f12] px-4 py-2 text-xs font-medium text-white">
                            <UserRoundCheck />
                            Agent
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 mb-6 mt-4"></div>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 mt-6"
                      >
                        <div>
                          <Label className="text-sm">
                            Agent Name <span className="text-red-500">*</span>
                          </Label>
                          <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                              <Input placeholder="John Marks" {...field} />
                            )}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm">
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </Label>

                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <Input placeholder="email" {...field} />
                            )}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <div className="relative">
                            <Label className="text-sm ">
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </Label>

                            <Controller
                              name="phoneNumber"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  placeholder="phone number"
                                  value={formatUSPhone(field.value ?? "")}
                                  onChange={(e) => {
                                    const digits = e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 10);
                                    field.onChange(digits);
                                  }}
                                  inputMode="numeric"
                                />
                              )}
                            />
                            {phoneValue?.length === 10 && (
                              <div
                                variant="ghost"
                                type="button"
                                size="icon"
                                className="absolute right-3 bottom-[14px] cursor-pointer m-0 p-0 px-0 h-auto w-auto"
                              >
                                <Check className="text-green-500  w-4 h-4" />
                              </div>
                            )}
                            {errors.phoneNumber && (
                              <p className="text-red-500 text-xs">
                                {errors.phoneNumber.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm">
                            Broker List <span className="text-red-500">*</span>
                          </Label>

                          <Controller
                            name="selectedBroker"
                            control={control}
                            rules={{ required: "Please select a broker" }}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select broker" />
                                </SelectTrigger>

                                <SelectContent>
                                  {dropdownOptions.length === 0 ? (
                                    <SelectItem disabled value="no-data">
                                      No brokers found
                                    </SelectItem>
                                  ) : (
                                    dropdownOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />

                          {errors.selectedBroker && (
                            <p className="text-red-500 text-xs">
                              {errors.selectedBroker.message}
                            </p>
                          )}
                        </div>
                        {error && (
                          <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                        <div className="flex flex-row gap-1">
                          <Button
                            type="button"
                            onClick={handleSkip}
                            className="mt-4 flex w-1/3 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#3b1f12] to-[#5c2f1b] px-4 py-2 text-sm font-medium text-white"
                          >
                            Skip
                            <ArrowRight size={18} />
                          </Button>
                          <Button
                            type="submit"
                            className="mt-4 flex w-2/3 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#3b1f12] to-[#5c2f1b] px-4 py-2 text-sm font-medium text-white"
                            disabled={isSubmitting || isLoading}
                          >
                            Invite Agent
                            {isLoading ? (
                              <Loader className="animate-spin" size={18} />
                            ) : (
                              <ArrowRight size={18} />
                            )}
                          </Button>
                        </div>
                        <style jsx>{`
                          input.password-input {
                            -webkit-text-security: disc;
                            text-security: disc;
                            font-size: 20px;
                            color: #5c4033; /* brown */
                          }
                          input.password-input::placeholder {
                            color: #aaa;
                          }
                        `}</style>

                        <div className="border-t border-gray-200 mb-6 mt-4"></div>

                        <div className="text-center my-4 text-sm">
                          <span>Already have an account? </span>
                          <Link
                            to="/subscription-login"
                            className="text-secondary"
                          >
                            Login Now
                          </Link>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubscriptionAddOrdAgent;
