import { Auth } from "aws-amplify";

//export const forgotPassword = async (username) => {
//  try {
//    const response = await Auth.forgotPassword(username);
//
//    console.log("Password reset code sent to user's email.");
//    return response;
//  } catch (error) {
//    console.error("Error in forgot password:", error);
//  }
//};

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

//export const resendOTP = async (username) => {
//  try {
//    await Auth.resendSignUp(username);
//    console.log("New OTP sent successfully.");
//  } catch (error) {
//    if (error.code === "LimitExceededException") {
//      console.error("Too many attempts. Please wait before resending the OTP.");
//    } else {
//      console.error("Error resending OTP:", error);
//    }
//  }
//};
