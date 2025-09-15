import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, Loader } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function Register(){

    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log()
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();
        const { email, password, confirmPassword } = formData;
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
    }


    return(
    <div className="grid items-center place-items-center h-dvh w-full overflow-auto py-10 px-4 bg-secondary">
      <img src="/login-bg.jpg" className="w-full h-full object-cover absolute inset-0 " alt="login background" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border rounded-4xl  p-4 px-5 md:px-10 max-w-md w-full bg-white relative z-10" 
      >
          <div className="text-center mb-6 text-secondary" >
            <img className="mx-auto w-24 md:w-32 mb-2" src="/Logo.svg" alt="logo" />
            <p className="text-[26px] font-semibold" > Create Account</p>
            <p className="text-[#554536]" >Please enter your details to register</p>
          </div>
        <form className="space-y-4 text-secondary" onSubmit={handleSubmit} >
          <div>
            <Label htmlFor="email" className="text-sm" >Email</Label>
            <Input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              className="bg-transparent"
              required
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm" >Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              className="bg-transparent"
              required
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-sm" >Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              className="bg-transparent"
              required
              onChange={(e) => handleChange(e)}
            />
          </div>
       
          <Button
            disabled={!(Object.values(formData).map(e => e.trim()).every(Boolean))}
            // disabled={isChecking || !username || !password}
            // onClick={() => handleLogin()}
            className="w-full"
            variant="secondary"
            size="lg"
          >
            Register
            {false ? <Loader className="animate-spin" /> : <ArrowRight />}
          </Button>
          {error && <div className="text-red-500 text-center text-sm font-medium">{error}</div>}
             
        </form>
        <div className="text-center my-4 text-sm" >
            <span>Already have an account? </span>
            <Link to="/login" className="text-secondary" >Login</Link>
        </div>
        <div className="flex justify-center my-4 mt-6 text-secondary group" >
          <Link to={"/"} className="inline-flex items-center gap-2" >
              <ChevronLeft size={20} className="group-hover:mr-2 transition-all" /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
    )
}