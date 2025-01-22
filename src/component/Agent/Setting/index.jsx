import { Auth } from "aws-amplify";
import React, { useState } from "react";
import "./index.css";

const Setting = () => {
  const [newpassword, setNewpassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
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
    <div class="setting-main-content">
      <div class="setting-page-title">
        <h1>Settings</h1>
      </div>
      <div className="password-card">
        <h3>Update Password</h3>
        <form>
          <div className="form-group">
            <label htmlFor="current-password" className="form-label">
              Current Password
            </label>
            <input
              type="password"
              id="current-password"
              name="current-password"
              placeholder="Current password"
              className="form-input"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              placeholder="New password"
              className="form-input"
              value={newpassword}
              onChange={(e) => setNewpassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirm new password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => updatePassword()}
            disabled={isDisabled}
            className="change-password-button"
          >
            Change Password
          </button>
          {isError && (
            <small className="error-state">Error in updating password</small>
          )}
          {isSuccess && (
            <small className="success-state">
              Password Changed Successfully!
            </small>
          )}
        </form>
      </div>
    </div>
  );
};

export default Setting;
