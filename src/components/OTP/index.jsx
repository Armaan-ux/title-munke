import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../service/auth";
import logo from "../../img/Logo.svg";
import "./index.css";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function ResetPasswordWithOTP({ username }) {
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
            <Label for="password" className="text-base" >Reset Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
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
