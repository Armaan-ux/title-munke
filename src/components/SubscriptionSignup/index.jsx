import { use, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  UserRoundCheck,
  Loader,
} from "lucide-react";
import { EnterCodeModal } from "../Modal/EnterCodeModal";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import {
  confirmEmail,
  registerUser,
  resendConfirmationCode,
  updateUserStatus,
} from "../service/userAdmin";
import { useUser } from "@/context/usercontext";
import { Label } from "../ui/label";
import { motion } from "motion/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/formSchema";
import { formatUSPhone } from "@/utils/date";
import { handleCreateAuditLog } from "@/utils";
import {
  saveSubscriptionData,
  getSubscriptionData,
} from "@/utils/subscriptionStorage";
function SubscriptionSignup() {
  const navigate = useNavigate();
  const { userType, planId } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, signIn } = useUser();
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [codeModal, setCodeModal] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  // Load existing data if available
  useEffect(() => {
    const savedData = getSubscriptionData();
    if (savedData) {
      reset({
        name: savedData.name || "",
        phoneNumber: savedData.phoneNumber || "",
        email: savedData.email || "",
        password: savedData.password || "",
        confirmPassword: savedData.password || "",
        termsAccepted: true,
      });
      // If the user was on the OTP screen, show it again
      if (savedData.isOtpVisible) {
        setCodeModal(true);
      }
    }
  }, [reset]);

  const formValues = watch();
  useEffect(() => {
    // Save to localStorage whenever important fields change, including OTP modal state
    const { name, email, phoneNumber, password } = formValues;
    if (name || email || phoneNumber) {
      saveSubscriptionData(
        { name, email, phoneNumber, password, isOtpVisible: codeModal },
        window.location.pathname,
      );
    }
  }, [formValues, codeModal]);

  const phoneValue = watch("phoneNumber");
  const isValidUSPhone = phoneValue?.length === 10;

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
      localStorage.removeItem("price");
    }
  }, [user, navigate]);

  // Resgister User Form Mutation
  const registerUserMutation = useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: (response) => {
      setCodeModal(true);
      const userId = response?.id;
      const usertype = response?.__typename.toLowerCase();
      saveSubscriptionData({ userId, usertype }, window.location.pathname);
    },
    onError: (error) => {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
    },
  });
  const logHandler = async () => {
    await handleCreateAuditLog(
      "Account",
      { detail: `${userType} account created successfully` },
      userType === "agent",
      userType,
    );
    await handleCreateAuditLog(
      "Account",
      { detail: `${userType} login successfully` },
      userType === "agent",
      userType,
    );
  };

  const onSubmit = (data) => {
    registerUserMutation.mutate({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      userType,
      planType: planId,
    });
    // Immediately persist that we are in OTP mode on success handled in mutation
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

  const handleLogin = async () => {
    const email = getValues("email");
    const password = getValues("password");

    if (userType === "broker") {
      navigate(`/subscription-addAgent/${planId}`);
    } else if (userType === "organisation") {
      navigate(`/subscription-addBroker/${planId}`);
    } else {
      navigate(`/subscription-payment/${planId}`);
    }

    const { isResetRequired, user: signedInUser } = await signIn(
      email?.trim(),
      password?.trim(),
    );
    const userId = signedInUser?.attributes?.sub;
    const userTypeValue =
      signedInUser?.signInUserSession?.idToken?.payload["cognito:groups"]?.[0];
    await updateUserStatus({ userId, userType: userTypeValue });
    logHandler();
    console.log("signedInUser after confirmation:", signedInUser);
  };

  // Confirm email code
  const confirmCodeMutation = useMutation({
    mutationFn: (code) =>
      confirmEmail({
        code: code?.trim(),
        email: getValues("email"),
      }),
    onSuccess: async (data) => {
      console.log("confirmation success:", data);
      // if(login){
      //     login()
      // } else {
      //     navigate("/login");
      // }

      handleLogin();
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  // Resend code
  const resendCodeMutation = useMutation({
    mutationFn: (email) => resendConfirmationCode(email),
    onSuccess: () => {
      setCooldown(30); // start 30-second timer
      toast.success("Resent code successfully send");
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  const submitModalHandler = (code) => {
    // console.log("Code entered in modal:", code);
    // setCode(false);
    // navigate("/subscription-payment");
    confirmCodeMutation.mutate(code);
  };

  const handleResend = () => {
    if (cooldown === 0 && !resendCodeMutation.isPending) {
      resendCodeMutation.mutate(getValues("email"));
    }
  };
  useEffect(() => {
    // Cleanup localStorage on unmount
    localStorage.removeItem("invitedAgents");
    localStorage.removeItem("invitedBroker");
    localStorage.removeItem("invitedOrgAgents");
  }, []);
  // if (isReset) return <ResetPassword username={username} password={password} />;

  return (
    <>
      <EnterCodeModal
        open={codeModal}
        onOpenChange={setCodeModal}
        onVerify={submitModalHandler}
        onResend={handleResend}
        confirmCodeMutation={confirmCodeMutation}
        email={getValues("email")}
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
                  {userType === "broker" || userType === "organisation" ? (
                    <div className="flex items-center justify-center mb-5">
                      <div className="flex items-center rounded-full bg-[#f6efe6] px-2 py-1 shadow-sm">
                        {/* Active Step */}
                        <div className="flex items-center gap-2 rounded-full bg-[#3b1f12] px-4 py-2 text-xs font-medium text-white">
                          <UserRoundCheck />
                          Info.
                        </div>

                        {/* Connector */}
                        <div className="mx-3 h-[2px] w-12 bg-[#BEA998]" />
                        {/* Active Step */}
                        <div className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[#7a5a49]">
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
                  ) : (
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
                        <div className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[#7a5a49]">
                          <CreditCard />
                          Add Card
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-2 border-[#e6d6c3] rounded-3xl p-4 bg-[#FFFFFF] ">
                  <p className="text-2xl font-semibold text-[#3b1f12]">
                    Create Your account
                  </p>
                  <p className="mt-1 text-sm text-[#7a5a49]">
                    Start your secure onboarding.
                  </p>
                  <div className="border-t border-gray-200 mb-6 mt-4"></div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 mt-6"
                  >
                    <div>
                      <Label className="text-sm">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder="John Marks"
                            {...field}
                            maxLength={45}
                          />
                        )}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <Label className="text-sm ">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          name="phoneNumber"
                          control={control}
                          format="US"
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
                        {isValidUSPhone && (
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
                        Email <span className="text-red-500">*</span>
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
                    <div className="flex gap-4">
                      <div className="relative">
                        <Label className="text-sm">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center">
                          <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                              <Input
                                placeholder="password"
                                type={showPassword ? "text" : "password"}
                                className="bg-transparent pr-9"
                                {...field}
                              />
                            )}
                          />

                          <Button
                            variant="ghost"
                            type="button"
                            size="icon"
                            className="absolute right-3 bottom-[14px] cursor-pointer m-0 p-0 px-0 h-auto w-auto"
                            onClick={() => setShowPassword((pre) => !pre)}
                          >
                            {!showPassword && (
                              <Eye className="text-tertiary text-500 w-4 h-4" />
                            )}
                            {showPassword && (
                              <EyeOff className="text-tertiary text-500 w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="relative">
                        <Label className="text-sm">
                          Confirm Password{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          name="confirmPassword"
                          control={control}
                          render={({ field }) => (
                            <Input
                              placeholder="confirm password"
                              type={showConfirmPassword ? "text" : "password"}
                              className="bg-transparent pr-9"
                              {...field}
                            />
                          )}
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          size="icon"
                          className="absolute right-3 bottom-[14px] cursor-pointer m-0 p-0 px-0 h-auto w-auto"
                          onClick={() => setShowConfirmPassword((pre) => !pre)}
                        >
                          {!showConfirmPassword && (
                            <Eye className="text-tertiary text-500 w-4 h-4" />
                          )}
                          {showConfirmPassword && (
                            <EyeOff className="text-tertiary text-500 w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs">
                        {errors.password.message}
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs">
                        {errors.confirmPassword.message}
                      </p>
                    )}

                    <div className="flex items-start gap-2 mb-10 ">
                      <Controller
                        name="termsAccepted"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-[#d8c3ab] text-[#3b1f12] focus:ring-[#3b1f12]"
                            {...field}
                          />
                        )}
                      />
                      <Label htmlFor="terms" className="text-sm text-[#3b1f12]">
                        I agree to the
                        <a href="/terms" className="font-medium underline mx-1">
                          Terms and Conditions
                        </a>
                        .
                      </Label>
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                    <Button
                      type="submit"
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#3b1f12] to-[#5c2f1b] px-4 py-2 text-sm font-medium text-white"
                      disabled={isSubmitting || registerUserMutation.isPending}
                    >
                      Send Verification
                      {registerUserMutation.isPending ? (
                        <Loader className="animate-spin" size={18} />
                      ) : (
                        <ArrowRight size={18} />
                      )}
                    </Button>
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
                      <Link to="/subscription-login" className="text-secondary">
                        Login Now
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubscriptionSignup;
