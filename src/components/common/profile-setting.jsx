import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Auth } from "aws-amplify";
import React, { useState } from "react";
// import "./index.css";

const ProfileSetting = ({ setIsProfile, editProfile }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");

  return (
    <div className="bg-[#F5F0EC] h[100vh] flex items-start justify-start text-secondary">
      {editProfile === true ? (
        <div className="bg-white rounded-xl p-8 flex flex-col md:flex-row items-start gap-10 w-full h-[78vh] shadow-md">
          <div className="flex flex-col w-full">
            <div className="mb-5">
              <p className="text-xl font-medium">Edit Profile</p>
            </div>

            <div className="flex flex-row gap-10 pt-5 border-t border-gray-200 mb-8">
              <div className="flex flex-col items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
                  alt="Profile"
                  className="w-60 h-60 rounded-2xl object-cover"
                />
                <Button
                  variant="outline"
                  className="border-[#9C3D26] text-[#9C3D26] hover:bg-[#9C3D26] hover:text-white rounded-md px-6 w-full"
                  onClick={() => setIsProfile(false)}
                >
                  Upload Image
                </Button>
              </div>

              <form className="space-y-6 flex-1 w-full">
                <div>
                  <Label htmlFor="current-password" className="">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="phone"
                    name="username"
                    placeholder="Name"
                    className="font-medium placeholder:text-base placeholder:font-normal mt-5"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="new-password" className="">
                    Phone Number
                  </Label>
                  <Input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    className="font-medium placeholder:text-base placeholder:font-normal mt-5"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="">
                    Email id
                  </Label>
                  <Input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="font-medium placeholder:text-base placeholder:font-normal mt-5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="new-password" className="">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    id="new-password"
                    name="new-password"
                    placeholder="New password"
                    className="font-medium placeholder:text-base placeholder:font-normal mt-5"
                    value={newpassword}
                    onChange={(e) => setNewpassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="">
                    Confirm New Password
                  </Label>
                  <Input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="Confirm new password"
                    className="font-medium placeholder:text-base placeholder:font-normal mt-5"
                    value={confirmPassword}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                  />
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

            <div className=" pt-8 border-t border-gray-200 justify-end flex gap-4">
              <Button
                variant="outline"
                className="border-[#9C3D26] text-[#9C3D26] hover:bg-[#9C3D26] hover:text-white rounded-md px-12"
                onClick={() => setIsProfile(false)}
              >
                Cancel
              </Button>

              <Button
                variant="outline"
                className="bg-tertiary text-white hover:bg-[#9C3D26] hover:text-white rounded-md px-12"
                onClick={() => setIsProfile(false)}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 flex flex-col md:flex-row items-start gap-10 w-full h-[78vh] shadow-md">
          <div className="flex flex-col items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
              alt="Profile"
              className="w-60 h-60 rounded-2xl object-cover"
            />
            <Button
              variant="outline"
              className="border-[#9C3D26] text-[#9C3D26] hover:bg-[#9C3D26] hover:text-white rounded-md px-6 w-full"
              onClick={() => setIsProfile(true)}
            >
              Edit Profile
            </Button>
          </div>

          <form className="space-y-6 flex-1">
            <div>
              <Label htmlFor="current-password" className="">
                Name
              </Label>
              <Input
                type="text"
                disabled
                id="current-password"
                name="current-password"
                placeholder="Current password"
                className="bg-[#F5F0EC] text-base font-normal border-none focus-visible:ring-0 mt-5"
                value={"John Doe"}
              />
            </div>

            <div>
              <Label htmlFor="new-password" className="">
                Phone Number
              </Label>
              <Input
                type="text"
                id="new-password"
                disabled
                name="new-password"
                placeholder="New password"
                className="bg-[#F5F0EC] text-base font-normal border-none focus-visible:ring-0 mt-5"
                value={"+1 658 658 4878"}
                //   onChange={(e) => setNewpassword(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="confirm-password" className="">
                Email id
              </Label>
              <Input
                type="text"
                id="confirm-password"
                disabled
                name="confirm-password"
                placeholder="Confirm new password"
                className="bg-[#F5F0EC] text-base font-normal border-none focus-visible:ring-0 mt-5"
                value={"john@email.com"}
                //   onChange={(e) => setConfirmpassword(e.target.value)}
              />
            </div>

            {isError && (
              <small className="text-red-600">Error in updating password</small>
            )}
            {isSuccess && (
              <small className="text-green-600">
                Password Changed Successfully!
              </small>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileSetting;
