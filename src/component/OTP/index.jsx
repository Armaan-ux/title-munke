import { useState } from "react";
import { toast } from "react-toastify";
import { confirmUser } from "../service/agent";

function OTP({ username, resetForLogin }) {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async () => {
    try {
      const user = await confirmUser(username, newPassword);
      if (user === "SUCCESS") {
        toast.success("User Confimed successfully, please login to continue");
        resetForLogin();
      }
    } catch (error) {
      setError(error.message || "Password reset failed");
    }
  };

  return (
    <div className="main">
      <div className="login-container">
        <form className="login-form">
          <h2>Title Munke</h2>
          <div className="form-group">
            <label for="password">Enter OTP</label>
            <input
              type="text"
              id="password"
              name="password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button
            onClick={() => handlePasswordReset()}
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

export default OTP;
