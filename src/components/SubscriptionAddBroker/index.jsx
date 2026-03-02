import { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getBrokerDetails } from "../service/userAdmin";
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
import { addBrokerSchema } from "@/formSchema";
import { useUserIdType } from "@/hooks/useUserIdType";
import AgentAddedSuccessModal from "../Modal/AgentAddedSuccessModal";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/context/usercontext";
import { formatUSPhone } from "@/utils/date";
function SubscriptionAddBroker() {
  const navigate = useNavigate();
  const { planId } = useParams();
  const { organisationDetail } = useUser();
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [lastAddedBrokerName, setLastAddedBrokerName] = useState("");
  const [addBroker, setAddBroker] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { userType, userId } = useUserIdType();

  const { id: organisationId } = organisationDetail || {};

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addBrokerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      teamStrength: "",
    },
  });
  const phoneValue = watch("phoneNumber");

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    setIsLoading(true);
    const existingBroker =
      JSON.parse(localStorage.getItem("invitedBroker")) || [];

    const isDuplicate = existingBroker.some(
      (agent) => agent.email.toLowerCase() === data.email.toLowerCase(),
    );

    if (isDuplicate) {
      setError("Broker with this email already exists.");
      setIsLoading(false);
      return;
    }
    const newBroker = {
      customUUID: uuidv4(),
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      teamStrength: data.teamStrength,
      planType: planId,
      organisationId,
      userType: "broker",
    };

    // Add new agent
    const updatedBrokers = [...existingBroker, newBroker];

    // Save back to localStorage
    localStorage.setItem("invitedBroker", JSON.stringify(updatedBrokers));

    setLastAddedBrokerName(data.name);
    console.log("Saved brokers:", updatedBrokers);
    reset();
    // Show success modal
    setAddBroker(true);
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
    navigate(`/subscription-addOrgAgent/${planId}`);
    if (planId === "EXPLORE_PLAN") {
      navigate(`/subscription-payment/${planId}`);
    }
  };
  const handleSkip = () => {
    navigate(`/subscription-addOrgAgent/${planId}`);
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
        isBroker={true}
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
                          <div className="mx-3 h-[2px] w-12 bg-[#BEA998]" />

                          {/* Inactive Step */}
                          <div className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[#7a5a49]">
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
                            Broker Name <span className="text-red-500">*</span>
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
                            Team Strength{" "}
                            <span className="text-red-500">*</span>
                          </Label>

                          <Controller
                            name="teamStrength"
                            control={control}
                            rules={{
                              required: "Please select a team strength",
                            }}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem value="10">10</SelectItem>
                                  <SelectItem value="20">20</SelectItem>
                                  <SelectItem value="30">30</SelectItem>
                                  <SelectItem value="40">40</SelectItem>
                                  <SelectItem value="unlimited">
                                    unlimited
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />

                          {errors.teamStrength && (
                            <p className="text-red-500 text-xs">
                              {errors.teamStrength.message}
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
                            Invite Broker
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

export default SubscriptionAddBroker;
