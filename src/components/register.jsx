import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, Loader, Check } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { confirmEmail, registerUser } from "./service/userAdmin";
import VerifyEmail from "./verify-email";
import { TEAMS } from "@/utils/constant";

const ROLES = ["individual", "broker"];


export default function Register() {

  const [showCodeForm, setShowCodeForm] = useState(false);
  const [error, setError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    team: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    // code: ""
  });

  const registerUserMutation = useMutation({
    mutationFn: data => registerUser(data),
    onSuccess: () => {
      // console.log('success');
      setShowCodeForm(true)
    },
    onError: (error) => {
      console.log('error', error);
      setError(error.response?.data?.error || "Something went wrong. Please try again later.")
    }
  })


  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log();
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      role,
      team,
      email,
      password,
      confirmPassword,
      termsAccepted,
    } = formData;
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    registerUserMutation.mutate({
      name,
      email,
      password,
      userType: formData.role,
      teamStrength: formData.team,
    })


  };

  return (
    <div className="grid items-center place-items-center h-dvh w-full overflow-auto py-10 px-4 bg-secondary">
      <img
        src="/login-bg.jpg"
        className="w-full h-full object-cover absolute inset-0 "
        alt="login background"
      />
      {
        showCodeForm && formData.email ?
        <VerifyEmail email={formData.email} />
      //   <motion.div
      //     initial={{ opacity: 0, y: 20 }}
      //     animate={{ opacity: 1, y: 0 }}
      //     transition={{ duration: 0.5 }}
      //     // className="border rounded-4xl  p-4 px-5 md:px-10 max-w-md w-full bg-white relative z-10"
      //     className="relative z-10  max-w-md bg-white rounded-4xl shadow-lg  md:p-10 p-4 px-5"
      //   >
      //   <div className="text-center mb-6">
      //     <img
      //       className="mx-auto w-20 md:w-24 mb-3"
      //       src="/Logo.svg"
      //       alt="Title Munke Logo"
      //     />
      //     <h2 className="text-2xl font-semibold text-[#2c150f] mb-1">
      //       Enter code
      //     </h2>
      //     <p className="text-sm text-[#5b4636]">
      //       Please enter code sent to your email.
      //     </p>
      //   </div>

      //   <Input
      //     id="code"
      //     name="code"
      //     value={formData.code}
      //     onChange={handleChange}
      //     required
      //     placeholder="Enter code"
      //     className="mt-1 h-11 border-[#d5c3b5] bg-white text-[#2c150f] focus-visible:ring-0"
      //   />

      //   <Button
      //     type="submit"
      //     disabled={!formData.code || confirmCodeMutation.isPending}
      //     className="mt-6 w-full"
      //     variant="secondary"
      //     onClick={() => confirmCodeMutation.mutate(formData.code)}
      //   > 
        
      //     Verify
      //     {
      //       confirmCodeMutation.isPending ? <Loader className="animate-spin" size={18} /> : <ArrowRight size={18} />
      //     }
      //   </Button>
      //     {confirmCodeMutation.isError && (
      //       <p className="text-red-500 text-center text-sm font-medium mt-4">
      //         {confirmCodeMutation.error.response?.data?.error || confirmCodeMutation.error.response?.data?.message}
      //       </p>
      //     )}
      // </motion.div>
      :

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // className="border rounded-4xl  p-4 px-5 md:px-10 max-w-md w-full bg-white relative z-10"
        className="relative z-10  max-w-md bg-white rounded-4xl shadow-lg p-8 md:p-10 p-4 px-5"
      >
        <div className="text-center mb-6">
          <img
            className="mx-auto w-20 md:w-24 mb-3"
            src="/Logo.svg"
            alt="Title Munke Logo"
          />
          <h2 className="text-2xl font-semibold text-[#2c150f] mb-1">
            Sign Up
          </h2>
          <p className="text-sm text-[#5b4636]">
            Please enter your details to Sign Up.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="role" className="text-sm text-[#2c150f]">
              Select Role
            </Label>
            <Select
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, role: val }))
              }
            >
              <SelectTrigger className="mt-1 w-full h-11 text-[#2c150f] border-[#d5c3b5] focus:ring-0 capitalize">
                <SelectValue
                  placeholder="Select role"
                  className="text-[#2c150f]"
                />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((item, index) => (
                  <SelectItem key={index} value={item.toLowerCase()} className="capitalize" >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {formData.role === "broker" && (
            <div>
              <Label htmlFor="role" className="text-sm text-[#2c150f]">
                Team Strength <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, team: val }))
                }
              >
                <SelectTrigger className="mt-1 w-full h-11 text-[#2c150f] border-[#d5c3b5] focus:ring-0">
                  <SelectValue
                    placeholder="Select strength"
                    className="text-[#2c150f]"
                  />
                </SelectTrigger>
                <SelectContent>
                  {TEAMS.map((item, index) => (
                    <SelectItem key={index} value={item.toLowerCase()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="name" className="text-sm text-[#2c150f]">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Marks"
              className="mt-1 h-11 border-[#d5c3b5] bg-white text-[#2c150f] focus-visible:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm text-[#2c150f]">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@titlemunke.com"
                className="mt-1 h-11 border-[#d5c3b5] bg-white text-[#2c150f] focus-visible:ring-0"
              />
              {/* {isEmailValid && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" />
              )} */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="password" className="text-sm text-[#2c150f]">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 focus:border-brown-500 text-gray-800 rounded-lg px-4 py-3 pr-10 focus:outline-none bg-white password-input"
                />
                {/* <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" /> */}
              </div>
            </div>
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm text-[#2c150f]"
              >
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 focus:border-brown-500 text-gray-800 rounded-lg px-4 py-3 pr-10 focus:outline-none bg-white password-input"
                />
                {/* <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" /> */}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Checkbox 
              id="terms"
              name="termsAccepted"
              checked={formData.termsAccepted}
              // onChange={}
              onCheckedChange={value => setFormData((prev) => ({ ...prev, termsAccepted: value }))}
            />
            {/* <input
              type="checkbox"
              id="terms"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="accent-[#541a14] w-4 h-4 rounded border-[#d5c3b5]"
            /> */}
            <Label htmlFor="terms" className="text-sm text-[#2c150f] mb-0">
              I agree to the{" "}
              <Link
                to="/terms"
                className="underline font-medium text-[#2c150f]"
              >
                Terms and Conditions
              </Link>
              .
            </Label>
          </div>

          <Button
            type="submit"
            disabled={
              !(
                formData.role &&
                formData.name &&
                formData.email &&
                formData.password &&
                formData.confirmPassword &&
                formData.termsAccepted
              ) || registerUserMutation.isPending
            }
            className="w-full h-11 bg-gradient-to-r from-[#5a100d] to-[#2c150f] text-white rounded-md hover:opacity-90 transition-all flex justify-center items-center gap-2"
          >
            Sign up
            {registerUserMutation.isPending ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <ArrowRight size={18} />
            )}
          </Button>
          <style jsx>{`
            input.password-input {
              -webkit-text-security: disc;
              text-security: disc;
              font-size: 20px;
              color: #5c4033; /* brown */
            }
            input.password-input::placeholder {
              color: #aaa;
            }
          `}</style>

          {error && (
            <p className="text-red-500 text-center text-sm font-medium">
              {error}
            </p>
          )}
        </form>

        <p className="text-center text-sm mt-5 text-[#2c150f]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold underline">
            Log In
          </Link>
        </p>
      </motion.div>
      }

    </div>
  );
}
