import { useState } from "react";
import { toast } from "react-toastify";
import ResetPassword from "../ResetPassword";
import { forgotPassword } from "../service/auth";
import "./index.css";

function ForgetPassword() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);

  const handleForgetPassword = async () => {
    try {
      const response = await forgotPassword(username);
      if (response) {
        toast.success("OTP has sent to your email.");
        setIsReset(true);
      }
    } catch (error) {
      setError(error.message || "Password reset failed");
    }
  };

  if (isReset) return <ResetPassword username={username} />;
  return (
    <div className="main">
      <div className="login-container">
        <form className="login-form">
          <h2>Title Munke</h2>
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
          </div>
          <button
            onClick={() => handleForgetPassword()}
            className="loginBtn"
            type="button"
          >
            submit
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
