import { Auth } from "aws-amplify";

export const forgotPassword = async (username) => {
  try {
    const response = await Auth.forgotPassword(username);

    console.log("Password reset code sent to user's email.");
    return response;
  } catch (error) {
    console.error("Error in forgot password:", error);
  }
};

export const resetPassword = async (username, code, newPassword) => {
  try {
    const response = await Auth.forgotPasswordSubmit(
      username,
      code,
      newPassword
    );
    console.log("Password reset successful!");
    return response;
  } catch (error) {
    console.error("Error resetting password:", error);
  }
};
