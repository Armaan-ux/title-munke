import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Auth } from "aws-amplify";
import React, { useState } from "react";
// import "./index.css";

const Setting = () => {
  const [newpassword, setNewpassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const resetState = () => {
    setConfirmpassword("");
    setOldPassword("");
    setNewpassword("");
  };

  const updatePassword = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, oldPassword, newpassword);
      setIsSuccess(true);
      setIsError(false);
      resetState();
    } catch (error) {
      setIsSuccess(false);
      setIsError(true);
      console.error("Error updating password:", error);
    }
  };

  const isDisabled =
    !oldPassword ||
    !newpassword ||
    !confirmPassword ||
    newpassword !== confirmPassword;

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white rounded-xl p-8">
        <p className="text-xl font-medium mb-8" >Update Password</p>
        <form className="space-y-10 max-w-lg w-full" >
          <div>
            <Label htmlFor="current-password" className="">
              Current Password
            </Label>
            <Input
              type="password"
              id="current-password"
              name="current-password"
              placeholder="Current password"
              className="!text-xl !font-bold placeholder:text-base placeholder:font-normal"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
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
              className="!text-xl !font-bold placeholder:text-base placeholder:font-normal"
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
              className="!text-xl !font-bold placeholder:text-base placeholder:font-normal"
              value={confirmPassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
          </div>

          <Button
            type="button"
            onClick={() => updatePassword()}
            disabled={isDisabled}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            Change Password
          </Button>
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
    </div>
  );
};

export default Setting;
