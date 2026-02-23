import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ResetPassword from "../ResetPassword";
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
function SubscriptionLogin() {
  const location = useLocation();
  const navigate = useNavigate();
const { price } = location.state || {};
console.log("Price in SubscriptionLogin:", price);
  const { userType, planId} = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, setUser, signIn } = useUser();
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [codeModal, setCodeModal] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    // code: ""
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value.trimStart(),
    }));
  };

  // Resgister User Form Mutation
  const registerUserMutation = useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: () => {
      // console.log('success');
      setCodeModal(true);
    },
    onError: (error) => {
      console.log("error", error);
      setError(
        error.response?.data?.error ||
          "Something went wrong. Please try again later.",
      );
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, contact, password, confirmPassword, termsAccepted } =
      formData;
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    registerUserMutation.mutate({
      name,
      email,
      contact,
      password,
      userType,
      planType: planId,
    });
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
    navigate(`/subscription-payment/${planId}`, { state: { price } });
    const { isResetRequired, user: signedInUser } = await signIn(
      formData.email?.trim(),
      formData.password?.trim(),
    );
    const userId = signedInUser?.attributes?.sub;
    const userType =
      signedInUser?.signInUserSession?.idToken?.payload["cognito:groups"]?.[0];
    await updateUserStatus({ userId, userType });
    console.log("signedInUser after confirmation:", signedInUser);
  };

  // Confirm email code
  const confirmCodeMutation = useMutation({
    mutationFn: (code) =>
      confirmEmail({
        code,
        email: formData.email,
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
      resendCodeMutation.mutate(formData.email);
    }
  };

  // if (isReset) return <ResetPassword username={username} password={password} />;

  return (
    <>
      <EnterCodeModal
        open={codeModal}
        onOpenChange={setCodeModal}
        onVerify={submitModalHandler}
        onResend={handleResend}
        confirmCodeMutation={confirmCodeMutation}
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
                    <div className="mx-3 h-[2px] w-20 bg-[#BEA998]" />

                    {/* Inactive Step */}
                    <div className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[#7a5a49]">
                      <CreditCard />
                      Add Card
                    </div>
                  </div>
                </div>

                <div className="border-2 border-[#e6d6c3] rounded-3xl p-4 bg-[#FFFFFF] ">
                  <h3 className="text-2xl font-semibold text-[#3b1f12]">
                    Create Your account
                  </h3>
                  <p className="mt-1 text-sm text-[#7a5a49]">
                    Start your secure onboarding.
                  </p>
                  <div className="border-t border-gray-200 mb-6 mt-4"></div>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <Label className="text-sm">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="john title munke"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-transparent"
                        required
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <Label className="text-sm ">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="(212) 555-0199"
                          id="contact"
                          name="contact"
                          value={formData.contact}
                          onChange={handleChange}
                          className="bg-transparent"
                          required
                        />
                        {formData.contact?.length === 10 && (
                          <div
                            variant="ghost"
                            type="button"
                            size="icon"
                            className="absolute right-3 bottom-[14px] cursor-pointer m-0 p-0 px-0 h-auto w-auto"
                            onClick={() => setShowPassword((pre) => !pre)}
                          >
                            <Check className="text-green-500  w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="email"
                        placeholder="title@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-transparent"
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="relative">
                        <Label className="text-sm">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center">
                          <Input
                            type={showPassword ? "text" : "password"}
                            // placeholder="••••••••"
                            id="password"
                            name="password"
                            value={formData.password}
                            className="bg-transparent pr-9"
                            required
                            onChange={handleChange}
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
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          // placeholder="••••••••"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          className="bg-transparent pr-9"
                          required
                          onChange={handleChange}
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

                    <div className="flex items-start gap-2 mb-10 ">
                      <Input
                        type="checkbox"
                        id="terms"
                        name="termsAccepted"
                        className="mt-1 h-4 w-4 rounded border-[#d8c3ab] text-[#3b1f12] focus:ring-[#3b1f12]"
                        value={formData.termsAccepted}
                        onChange={handleChange}
                      />
                      <Label htmlFor="terms" className="text-sm text-[#3b1f12]">
                        I agree to the
                        <a href="/terms" className="font-medium underline mx-1">
                          Terms and Conditions
                        </a>
                        .
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#3b1f12] to-[#5c2f1b] px-4 py-2 text-sm font-medium text-white"
                      disabled={
                        !(
                          formData.name &&
                          formData.email &&
                          formData.contact &&
                          formData.password &&
                          formData.confirmPassword &&
                          formData.termsAccepted
                        ) || registerUserMutation.isPending
                      }
                    >
                      Continue
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

                    {error && (
                      <p className="text-red-500 text-center text-sm font-medium">
                        {error}
                      </p>
                    )}
                    <div className="border-t border-gray-200 mb-6 mt-4"></div>
                    {/* <p className="pt-4 text-center text-xs text-[#7a5a49]">
                      Already have an account?{" "}
                      <Link
                        to="/subscription-login"
                        className="font-medium text-[#3b1f12] hover:underline"
                      >
                        Log In
                      </Link>
                    </p> */}
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

export default SubscriptionLogin;
