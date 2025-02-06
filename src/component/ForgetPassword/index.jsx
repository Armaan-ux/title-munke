import { useState } from "react";
import { toast } from "react-toastify";
import ResetPassword from "../ResetPassword";
import { forgotPassword } from "../service/auth";
import logo from "../../img/Logo.svg";
import "./index.css";
import ResetPasswordWithOTP from "../OTP";

function ForgetPassword() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async () => {
    try {
      setLoading(true);
      const response = await forgotPassword(username);
      if (response) {
        toast.success("OTP has sent to your email.");
        setIsReset(true);
      }
    } catch (error) {
      setError(error.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (isReset) return <ResetPasswordWithOTP username={username} />;
  return (
    <div className="main">
      <div className="login-container">
        <form className="login-form">
          <div className="login-logo">
            <img src={logo} alt="logo" />
            {/* <h2>Title Munke</h2> */}
          </div>
          <div className="form-group">
            <label for="password">Enter Email</label>
            <input
              type="text"
              id="password"
              name="password"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <small>Please enter your email to reset your passsword</small>
          </div>
          <button
            onClick={() => handleForgetPassword()}
            className="forgotPasswordBtn"
            disabled={username.length === 0 || loading}
            type="button"
          >
            {loading ? "Processing...." : "submit"}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
