import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/usercontext";
import ResetPassword from "../ResetPassword";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, Eye, EyeOff, Loader } from "lucide-react";
import { motion } from "motion/react";
import VerifyEmail from "../verify-email";
import { useMutation } from "@tanstack/react-query";
import {
  confirmEmail,
  resendConfirmationCode,
  updateUserStatus,
} from "../service/userAdmin";
import { handleCreateAuditLog } from "@/utils";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { user, signIn } = useUser();
  const [isChecking, setIsChecking] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

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

  if (isReset) return <ResetPassword username={username} password={password} />;

  return (
    <div className="grid items-center place-items-center h-dvh w-full overflow-auto py-10 px-4 bg-secondary">
      <img
        src="/login-bg.jpg"
        className="w-full h-full object-cover absolute inset-0 "
        alt="login background"
      />
      {showCodeInput && username ? (
        <VerifyEmail email={username} login={handleLogin} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.5 }}
          className="border rounded-4xl  p-4 px-5 md:px-10 max-w-md w-full bg-white relative z-10"
        >
          <div className="text-center mb-6 text-secondary">
            <img
              className="mx-auto w-24 md:w-32 mb-2"
              src="/Logo.svg"
              alt="logo"
            />
            <p className="text-[26px] font-semibold">Welcome Back</p>
            <p className="text-[#554536]">Please enter your details to login</p>
          </div>
          <div className="border-t border-gray-200 mb-6 mt-4"></div>
          <form
            className="space-y-4 text-secondary"
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
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm hover:underline">
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
          </form>
          <div className="text-center my-4 text-sm">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-secondary">
              Register Now
            </Link>
          </div>
          <div className="flex justify-center my-4 mt-6 text-secondary group">
            <Link to={"/"} className="inline-flex items-center gap-2">
              <ChevronLeft
                size={20}
                className="group-hover:mr-2 transition-all"
              />{" "}
              Back to Home
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Login;
