import { Auth } from "aws-amplify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword({ username, password }) {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    try {
      const user = await Auth.signIn(username, password);
      const completedUser = await Auth.completeNewPassword(user, newPassword);

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
    }
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Title Munke</h2>
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
        <button onClick={() => handlePasswordReset()} type="button">
          Reset
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default ResetPassword;
