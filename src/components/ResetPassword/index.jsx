import { Auth } from "aws-amplify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/usercontext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {motion} from "motion/react"


function ResetPassword({ username, password }) {
  const { signIn } = useUser();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
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
    <div  >

      <div className="grid items-center place-items-center h-dvh w-full overflow-auto py-10 px-4 bg-secondary" >
        <img src="/login-bg.jpg" className="w-full h-full object-cover absolute inset-0 " alt="login background" />

        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.5 }}
        className="border rounded-4xl py-8 md:py-12 px-5 md:px-10 max-w-md w-full bg-white relative z-10"  >

        <form className="space-y-6 text-secondary " onSubmit={e => handlePasswordReset(e)}  >
          <div className="login-logo">
            <img src="/Logo.svg" alt="logo" className="mx-auto w-24 md:w-32 mb-2" />
          </div>
          <div>
            <Label for="password" className="text-sm" >Reset Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button
            // type="button"
            className="w-full"
            variant="secondary"
            size="lg"
            // onClick={() => }
          >
            {loading ? "Processing..." : "Reset"}
          </Button>
          {error && <div className="text-red-500 text-center text-sm font-medium">{error}</div>}
        </form>
        </motion.div>

      </div>
    </div>
  );
}

export default ResetPassword;
