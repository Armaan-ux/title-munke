import { Auth } from "aws-amplify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/usercontext";
import logo from "../../img/Logo.svg";

function ResetPassword({ username, password }) {
  const { signIn } = useUser();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    try {
      setLoading(true);
      const user = await Auth.signIn(username, password);
      await Auth.completeNewPassword(user, newPassword);
      const { user: completedUser } = await signIn(username, newPassword);
      const groups =
        completedUser.signInUserSession.idToken.payload["cognito:groups"];
      if (groups.includes("admin")) {
        navigate("/admin");
      } else if (groups.includes("agent")) {
        navigate("/agent");
      } else if (groups.includes("broker")) {
        navigate("/broker");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="login-container">
        <form className="login-form">
          <div className="login-logo">
            <img src={logo} />
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
          <button
            onClick={() => handlePasswordReset()}
            className="loginBtn"
            type="button"
          >
            {loading ? "Processing..." : "Reset"}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
