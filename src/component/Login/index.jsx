// import "./index.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/Logo.svg";
import { useUser } from "../../context/usercontext";
import ResetPassword from "../ResetPassword";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";


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
    <div className="grid items-center place-items-center h-dvh w-full overflow-auto py-10 px-4 bg-secondary">
      <img src="/login-bg.jpg" className="w-full h-full object-cover absolute inset-0 " alt="login background" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.5 }}
        className="border rounded-4xl  p-4 px-5 md:px-10 max-w-md w-full bg-white relative z-10" 
      >
          <div className="text-center mb-6 text-secondary" >
            <img className="mx-auto w-24 md:w-32 mb-2" src="/Logo.svg" alt="logo" />
            <p className="text-[26px] font-semibold" >Welcome Back</p>
            <p className="text-[#554536]" >Please enter your details to login</p>
          </div>
        <form className="space-y-4 text-secondary">
          <div>
            <Label htmlFor="username" className="text-sm" >Email</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={username}
              className="bg-transparent"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm" >Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              className="bg-transparent"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end" >
            <Link to="/forgot-password" className="text-sm hover:underline" >
              Forgot Password?
            </Link>
          </div>
          <Button
            disabled={isChecking || !username || !password}
            onClick={() => handleLogin()}
            type="button"
            className="w-full"
            variant="secondary"
            size="lg"
          >
            {isChecking ? "Signing in.." : "Login"}
            <ArrowRight />
          </Button>
          {error && <div className="text-red-500 text-center text-sm font-medium">{error}</div>}
             
        </form>
        <div className="flex justify-center my-4 mt-6 text-secondary group" >
          <Link to={"/"} className="inline-flex items-center gap-2" >
              <ChevronLeft size={20} className="group-hover:mr-2 transition-all" /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
