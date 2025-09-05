import { useState } from "react";
import { toast } from "react-toastify";
import ResetPassword from "../ResetPassword";
import { forgotPassword } from "../service/auth";
import logo from "../../img/Logo.svg";
import "./index.css";
import ResetPasswordWithOTP from "../OTP";
import {motion} from "motion/react"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    
    <div className="grid items-center place-items-center h-dvh w-full overflow-auto py-10 px-4 bg-secondary">
        <img src="/login-bg.jpg" className="w-full h-full object-cover absolute inset-0 " alt="login background" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.5 }}
          className="border rounded-4xl py-8 md:py-12 px-5 md:px-10 max-w-md w-full bg-white relative z-10" 
        >
        <div className="text-center mb-6 text-secondary" >
          <img className="mx-auto w-24 md:w-32 mb-2" src="/Logo.svg" alt="logo" />
        </div>
        <form className="space-y-8 text-secondary">
          <div>
            <Label htmlFor="passwrod" className="text-sm" >Enter Email</Label>
            <Input
              type="text"
              id="password"
              name="password"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <small>Please enter your email to reset your passsword</small>
          </div>

          <Button
            type="button"
            className="w-full"
            variant="secondary"
            size="lg"

            onClick={() => handleForgetPassword()}
            disabled={username.length === 0 || loading}
          >
            {loading ? "Processing...." : "submit"}
          </Button>
          {error && <div className="text-red-500 text-center text-sm font-medium">{error}</div>}
             
        </form>

      </motion.div>
    </div>


    // <div className="main">
    //   <div className="login-container">
    //     <form className="login-form">
    //       <div className="login-logo">
    //         <img src={logo} alt="logo" />
    //         {/* <h2>Title Munke</h2> */}
    //       </div>
    //       <div className="form-group">
    //         <label for="password">Enter Email</label>
    //         <input
    //           type="text"
    //           id="password"
    //           name="password"
    //           value={username}
    //           required
    //           onChange={(e) => setUsername(e.target.value)}
    //         />
    //         <small>Please enter your email to reset your passsword</small>
    //       </div>
    //       <button
    //         onClick={() => handleForgetPassword()}
    //         className="forgotPasswordBtn"
    //         disabled={username.length === 0 || loading}
    //         type="button"
    //       >
    //         {loading ? "Processing...." : "submit"}
    //       </button>
    //       {error && <div className="error">{error}</div>}
    //     </form>
    //   </div>
    // </div>
  );
}

export default ForgetPassword;
