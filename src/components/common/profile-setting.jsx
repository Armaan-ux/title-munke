import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Auth } from "aws-amplify";
import { Eye, PencilLine, Upload } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
// import "./index.css";

const ProfileSetting = ({ setIsProfile, editProfile }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  return (
    <div className="bg-[#F5F0EC] flex items-start justify-start text-secondary">
      {editProfile === true ? (
        <div className="bg-white rounded-xl p-8 flex flex-col md:flex-row items-start gap-10 w-full shadow-md">
          <div className="flex flex-col w-full">
            <div className="mb-5">
              <p className="text-xl font-medium">Edit Profile</p>
            </div>

            <div className="flex flex-row gap-10 pt-5 border-t border-gray-200 mb-2">
              <div className="flex flex-col items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
                  alt="Profile"
                  className="w-60 h-60 rounded-2xl object-cover"
                />
                <Button
                  variant="outline"
                  className="border-none text-secondary hover:bg-tertiary hover:text-white rounded-md px-6 w-full bg-coffee-bg-billing-foreground"
                  onClick={() => setIsProfile(false)}
                >
                  <Upload /> Upload Image
                </Button>
              </div>

              <form className="space-y-6 flex-1 w-full">
                <div className="mb-9">
                  <Label
                    htmlFor="current-password"
                    className="text-secondary text-sm"
                  >
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="phone"
                    name="username"
                    placeholder="Name"
                    className="font-medium  placeholder:font-normal mt-3 bg-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-9">
                  <Label
                    htmlFor="new-password"
                    className="text-secondary text-sm"
                  >
                    Phone Number
                  </Label>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    className="font-medium  placeholder:font-normal mt-3 bg-white"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="confirm-password"
                    className="text-secondary text-sm"
                  >
                    Email id
                  </Label>
                  <Input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="font-medium  placeholder:font-normal mt-3 bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="justify-end flex gap-4 items-center mt-7 mb-5">
                  <Button
                    variant="secondary"
                    // className="bg-tertiary text-white hover:bg-[#9C3D26] hover:text-white rounded-md px-12 mb-6 w-[20%]"
                    size="lg"
                    onClick={() => setIsProfile(false)}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
            <Separator />
            <div className="w-full">
              <div>
                <p className="text-md font-medium mt-5">Change Password</p>
              </div>
              <form className="space-y-6 flex-1 w-full flex flex-row justify-between gap-5 mt-6">
                <div className="w-full">
                  <Label
                    htmlFor="new-password"
                    className="text-secondary text-sm"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      type="password"
                      id="current-password"
                      name="current-password"
                      placeholder="Current password"
                      className="font-medium  placeholder:font-normal mt-3 bg-white"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-500 w-4 h-4" />
                  </div>
                </div>

                <div className="w-full">
                  <Label
                    htmlFor="confirm-password"
                    className="text-secondary text-sm"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type="password"
                      id="new-password"
                      name="new-password"
                      placeholder="New password"
                      className="font-medium  placeholder:font-normal mt-3 bg-white"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-500 w-4 h-4" />
                  </div>
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="confirm-password"
                    className="text-secondary text-sm"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      placeholder="Confirm new password"
                      className="font-medium  placeholder:font-normal mt-3 bg-white "
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-500 w-4 h-4" />
                  </div>
                </div>

                {isError && (
                  <small className="text-red-600">
                    Error in updating password
                  </small>
                )}
                {isSuccess && (
                  <small className="text-green-600">
                    Password Changed Successfully!
                  </small>
                )}
              </form>
            </div>

            <div className="pt-3 pb-1 border-t border-gray-200 justify-end flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                // className="bg-tertiary text-white hover:bg-[#9C3D26] hover:text-white rounded-md px-12"
                onClick={() => setIsProfile(false)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 w-full">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-xl font-medium">Profile Details</p>
            <Button
              // size="icon"
              className="text-md"
              variant="ghost"
              onClick={() => setIsProfile(true)}
            >
              <PencilLine /> Edit Profile
            </Button>
          </div>
          <Separator />
          <div className="flex flex-col md:flex-row items-start gap-10 mt-6">
            <div className="flex flex-col items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
                alt="Profile"
                className="w-60 h-60 rounded-2xl object-cover"
              />
            </div>

            <form className="space-y-6 flex-1">
              <div>
                <Label htmlFor="name" className="">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Current password"
                  className="bg-[#F5F0EC] text-tertiary font-normal border-none focus-visible:ring-0 mt-5 pointer-events-none"
                  value={"John Doe"}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="New password"
                  className="bg-[#F5F0EC] text-tertiary font-normal border-none focus-visible:ring-0 mt-5 pointer-events-none"
                  value={"+1 658 658 4878"}
                  //   onChange={(e) => setNewpassword(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email" className="">
                  Email id
                </Label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Confirm new password"
                  className="bg-[#F5F0EC] text-tertiary font-normal border-none focus-visible:ring-0 mt-5 pointer-events-none"
                  value={"john@email.com"}
                  //   onChange={(e) => setConfirmpassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password" className="">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border border-gray-300 focus:border-brown-500 text-tertiary text-800 rounded-lg px-4 py-3 pr-10 focus:outline-none password-input pointer-events-none"
                    value={"john@email.com"}
                    //   onChange={(e) => setConfirmpassword(e.target.value)}
                  />
                  <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary text-500 w-4 h-4" />
                </div>
              </div>
              {isError && (
                <small className="text-red-600">
                  Error in updating password
                </small>
              )}
              {isSuccess && (
                <small className="text-green-600">
                  Password Changed Successfully!
                </small>
              )}
            </form>
          </div>
        </div>
      )}
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
    </div>
  );
};

export default ProfileSetting;
