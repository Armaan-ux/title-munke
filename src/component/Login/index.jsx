import "./index.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/Logo.svg";
import { useUser } from "../../context/usercontext";
import ResetPassword from "../ResetPassword";

function Login() {
  const { user, signIn } = useUser();
  const [isChecking, setIsChecking] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      user &&
      user.signInUserSession &&
      user.signInUserSession.idToken &&
      user.signInUserSession.idToken.payload &&
      user.signInUserSession.idToken.payload["cognito:groups"]
    ) {
      navigate("/" + user.signInUserSession.idToken.payload["cognito:groups"][0]);
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      setError("");
      setIsChecking(true);
      const { isResetRequired, user: signedInUser } = await signIn(username, password);

      if (isResetRequired) {
        setIsReset(true);
        return;
      }

      if (
        signedInUser &&
        signedInUser.signInUserSession &&
        signedInUser.signInUserSession.idToken &&
        signedInUser.signInUserSession.idToken.payload &&
        signedInUser.signInUserSession.idToken.payload["cognito:groups"]
      ) {
        const groups = signedInUser.signInUserSession.idToken.payload["cognito:groups"];
        if (groups.includes("admin")) {
          navigate("/admin");
        } else if (groups.includes("agent")) {
          navigate("/agent");
        } else if (groups.includes("broker")) {
          navigate("/broker");
        }
      } else {
        setError("User groups not available in the response. Please try again.");
      }
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setIsChecking(false);
    }
  };

  if (isReset) return <ResetPassword username={username} password={password} />;

  return (
    <div className="login-main">
      <div className="login-container">
        <form className="login-form">
          <div className="login-logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="form-group">
            <label htmlFor="username">Email</label>
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
            <label htmlFor="password">Password</label>
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
        <div className="back-link">
          <Link to={"/"}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
