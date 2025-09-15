import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../service/auth";
import logo from "../../img/Logo.svg";
import "./index.css";

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
    <div className="main">
      <div className="login-container">
        <form className="login-form">
          <div className="login-logo">
            <img src={logo} />
            {/* <h2>Title Munke</h2> */}
          </div>
          <div className="form-group">
            <label for="password">Reset Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label for="password">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              required
              onChange={(e) => setOTP(e.target.value)}
            />
          </div>
          <button
            onClick={() => handlePasswordReset()}
            className="loginBtn"
            disabled={!otp.length || !newPassword.length}
            type="button"
          >
            Reset
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordWithOTP;
