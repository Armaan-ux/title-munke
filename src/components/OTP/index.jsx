import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../service/auth";
import logo from "../../img/Logo.svg";
import "./index.css";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordWithOTP({ username }) {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    try {
      await resetPassword(username, otp, newPassword);
      toast.success("Password changed successfully");
      navigate("/login");
    } catch (error) {
      setError(error.message || "Password reset failed");
    }
  };

  return (
    <div className="z-10">
      <div className="">
          <div className="text-center mb-6 text-secondary" >
            <img className="mx-auto w-24 md:w-32 mb-2" src="/Logo.svg" alt="logo" />
          </div>
        <form className="space-y-4">
          <div>
            <Label for="password" className="text-base" >OTP</Label>
            <Input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              required
              onChange={(e) => setOTP(e.target.value)}
            />
          </div>
          <div className="relative">
            <Label for="password" className="text-base" >Reset Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
                variant="ghost"
                type="button"
                size="icon"
                className="absolute right-3 bottom-[14px] cursor-pointer m-0 p-0 px-0 h-auto w-auto" 
                onClick={() => setShowPassword(pre => !pre)}
              >
                {!showPassword && <Eye className="text-tertiary text-500 w-4 h-4"/>}
                {showPassword && <EyeOff className="text-tertiary text-500 w-4 h-4" />}
              </Button>
          </div>
          <Button
            onClick={() => handlePasswordReset()}
            disabled={!otp.length || !newPassword.length}
            type="button"
            className="w-full"
            size="lg"
            variant="secondary"
            >

            Reset
          </Button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordWithOTP;
