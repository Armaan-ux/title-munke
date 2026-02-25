import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/usercontext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, EyeOff, Loader } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { resendConfirmationCode, updateUserStatus } from "../service/userAdmin";
import { handleCreateAuditLog } from "@/utils";
import { motion } from "motion/react";

function SubscriptionLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const { user, signIn } = useUser();
  const [isChecking, setIsChecking] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (
  //     user &&
  //     user.signInUserSession &&
  //     user.signInUserSession.idToken &&
  //     user.signInUserSession.idToken.payload &&
  //     user.signInUserSession.idToken.payload["cognito:groups"]
  //   ) {
  //     navigate(
  //       "/" + user.signInUserSession.idToken.payload["cognito:groups"][0],
  //     );
  //   }
  // }, [user, navigate]);

  // if (isReset) return <ResetPassword username={username} password={password} />;

  const resendCodeMutation = useMutation({
    // mutationFn: code => confirmEmail({code: code, email: formData.email, userType: formData.role}),
    mutationFn: (email) => resendConfirmationCode(email),
    onSuccess: () => {
      // navigate("/login");
      setShowCodeInput(true);
    },
    onError: (error) => {
      console.log("error", error);
      // setError(error.response?.data?.error || error.response?.data?.message || "Something went wrong. Please try again later.")
    },
  });

  const handleLogin = async () => {
    try {
      setError("");
      setIsChecking(true);
      const { isResetRequired, user: signedInUser } = await signIn(
        username?.trim(),
        password?.trim(),
      );

      if (isResetRequired) {
        setIsReset(true);
        return;
      }
      const userId = signedInUser?.attributes?.sub;
      const userType =
        signedInUser?.signInUserSession?.idToken?.payload[
          "cognito:groups"
        ]?.[0];
      await handleCreateAuditLog(
        "login",
        { detail: `${userType} logged in successfully` },
        userType === "agent",
      );
      await updateUserStatus({ userId, userType });
      if (
        signedInUser &&
        signedInUser.signInUserSession &&
        signedInUser.signInUserSession.idToken &&
        signedInUser.signInUserSession.idToken.payload &&
        signedInUser.signInUserSession.idToken.payload["cognito:groups"]
      ) {
        const groups =
          signedInUser.signInUserSession.idToken.payload["cognito:groups"];
        if (groups.includes("admin")) {
          navigate("/admin");
        } else if (groups.includes("agent")) {
          navigate("/agent");
        } else if (groups.includes("broker")) {
          navigate("/broker");
        }
      } else {
        setError(
          "User groups not available in the response. Please try again.",
        );
      }
    } catch (error) {
      console.log("error ", error);
      if (error.name === "UserNotConfirmedException") {
        // setError("Your email is not confirmed. Please enter the verification code sent to your email.");
        resendCodeMutation.mutate(username);

        // setShowCodeInput(true); // <-- State variable to show confirmation code input
        return;
      }
      setError(error.message || "Login failed");
    } finally {
      setIsChecking(false);
    }
  };

  return (
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
            className="flex items-center justify-center p-6 sm:p-10 bg-[url('/bg-signin.png')] md:py-[100px]"
          >
            <div className="w-full max-w-sm">
              <div className="border-2 border-[#e6d6c3] rounded-3xl p-4 bg-[#FFFFFF] ">
                <p className="text-2xl font-semibold text-[#3b1f12]">
                  Welcome
                </p>
                <p className="mt-1 text-sm text-[#7a5a49]">
                  Please enter your details to Log in.
                </p>

                <div className="border-t border-gray-200 mb-6 mt-4"></div>
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  <div>
                    <Label htmlFor="username" className="text-sm">
                      Email
                    </Label>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      className="bg-transparent"
                      required
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="relative">
                      <Label htmlFor="password" className="text-sm">
                        Password
                      </Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        className="bg-transparent pr-9"
                        required
                        onChange={(e) => setPassword(e.target.value)}
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

                  <div className="flex justify-end gap-2 mb-10 ">
                    <Link
                      to="/forgot-password"
                      className="text-sm hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    disabled={isChecking || !username || !password}
                    // type="button"
                    className="w-full"
                    variant="secondary"
                    size="lg"
                  >
                    Login
                    {isChecking ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <ArrowRight />
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
                    <div className="text-red-500 text-center text-sm font-medium">
                      {error}
                    </div>
                  )}
                  <div className="border-t border-gray-200 mb-6 mt-4"></div>
                  {/* <p className="pt-4 text-center text-xs text-[#7a5a49]">
                    Already have an account?{" "}
                    <Link
                      to="/pricing"
                      className="font-medium text-[#3b1f12] hover:underline"
                    >
                      Sign up
                    </Link>
                  </p> */}
                  <div className="text-center my-4 text-sm">
                    <span>Don't have an account? </span>
                    <Link to="/pricing" className="text-secondary">
                      Register Now
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionLogin;
