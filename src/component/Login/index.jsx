import "./index.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OTP from "../OTP";
import logo from "../../img/Logo.svg";
import { useUser } from "../../context/usercontext";

function Login() {
  const { user, signIn } = useUser();
  const [isChecking, setIsChecking] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(
        "/" + user.signInUserSession.idToken.payload["cognito:groups"][0]
      );
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      setError("");
      setIsChecking(true);
      const { isResetRequired } = await signIn(username, password);

      if (isResetRequired) {
        setIsReset(true);
        return;
      }

      const groups = user.signInUserSession.idToken.payload["cognito:groups"];

      if (groups && groups.includes("admin")) {
        // Redirect to Admin dashboard
        navigate("/admin");
      } else if (groups && groups.includes("agent")) {
        // Redirect to User dashboard
        navigate("/agent");
      } else if (groups && groups.includes("broker")) {
        // Redirect to User dashboard
        navigate("/broker");
      }
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setIsChecking(false);
    }
  };

  const resetForLogin = () => {
    setPassword("");
    setUsername("");
    setIsReset(false);
  };

  if (isReset) return <OTP username={username} resetForLogin={resetForLogin} />;

  return (
    <div className="main">
      <div className="login-container">
        <form className="login-form">
          <div className="login-logo">
            <img src={logo} />
          </div>
          <div className="form-group">
            <label for="username">Email</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>
          <button
            disabled={isChecking || !username || !password}
            onClick={() => handleLogin()}
            type="button"
            className="loginBtn"
          >
            {isChecking ? "Signing in.." : "Login"}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;
