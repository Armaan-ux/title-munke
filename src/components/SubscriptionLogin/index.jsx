import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/usercontext";
import ResetPassword from "../ResetPassword";
import { Button } from "@/components/ui/button";
import {
  Check,
  CreditCard,
  Eye,
  EyeOff,
  UserRoundCheck,
} from "lucide-react";


function SubscriptionLogin() {
   
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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


  if (isReset) return <ResetPassword username={username} password={password} />;

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
          <div className="flex items-center justify-center p-6 sm:p-10 bg-[url('/bg-signin.png')]">
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

                <form className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm text-[#3b1f12]">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="mt-1 w-full rounded-md border border-[#e6d6c3] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#3b1f12]"
                      placeholder="john title munke"
                    />
                  </div>
                  <div>
                    <div className="relative">
                      <label className="text-sm text-[#3b1f12]">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="mt-1 w-full rounded-md border border-[#e6d6c3] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#3b1f12]"
                        placeholder="(212) 555-0199"
                      />
                      <div
                        variant="ghost"
                        type="button"
                        size="icon"
                        className="absolute right-3 bottom-[14px] cursor-pointer m-0 p-0 px-0 h-auto w-auto"
                        onClick={() => setShowPassword((pre) => !pre)}
                      >
                        <Check className="text-green-500  w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[#3b1f12]">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="mt-1 w-full rounded-md border border-[#e6d6c3] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#3b1f12]"
                      placeholder="john@titlemunke.com"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="relative">
                      <label className="text-sm text-[#3b1f12]">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="mt-1 w-full rounded-md border border-[#e6d6c3] bg-transparent mb-1 px-3 py-2 pr-10 text-sm outline-none focus:border-[#3b1f12]"
                          placeholder="••••••••"
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
                      <label className="text-sm text-[#3b1f12]">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="mt-1 w-full rounded-md border border-[#e6d6c3] bg-transparent px-3 py-2 pr-10 text-sm outline-none focus:border-[#3b1f12]"
                        placeholder="••••••••"
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
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 h-4 w-4 rounded border-[#d8c3ab] text-[#3b1f12] focus:ring-[#3b1f12]"
                    />
                    <label htmlFor="terms" className="text-sm text-[#3b1f12]">
                      I agree to the
                      <a href="/terms" className="font-medium underline">
                        Terms and Conditions
                      </a>
                      .
                    </label>
                  </div>

                  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#3b1f12] to-[#5c2f1b] px-4 py-2 text-sm font-medium text-white" onClick={navigate('/subscription-payment')}>
                    Continue →
                  </button>

                  <p className="pt-4 text-center text-xs text-[#7a5a49]">
                    Already have an account?{" "}
                    <a
                      href="/subscription-payment"
                      className="font-medium text-[#3b1f12] hover:underline"
                    >
                      Log In
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionLogin;
