import { API, Auth } from "aws-amplify";
import { createAuditLog } from "./graphql/mutations";
import { format, toZonedTime } from "date-fns-tz";
export const INTERVALTIME = 3000;
export const FETCH_LIMIT = 100;
export const getFormattedDateTime = (lastLoginUTC) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const zonedDate = toZonedTime(new Date(lastLoginUTC), userTimeZone);
  const formattedDate = format(zonedDate, "yyyy-MM-dd HH:mm:ss", {
    timeZone: userTimeZone,
  });

  return formattedDate;
};

export const handleCreateAuditLog = async (action, detail, isAgent = false) => {
  const user = await Auth.currentAuthenticatedUser();
  const input = {
    userId: user?.attributes?.sub,
    action,
    detail: JSON.stringify(detail),
    isAgent,
    email: user?.attributes?.email,
  };

  try {
    const result = await API.graphql({
      query: createAuditLog,
      variables: { input },
    });
    console.log("Audit Log Created:", result.data.createAuditLog);
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};

export const generatePassword = (
  includeNumbers = true,
  includeSymbols = true,
  length = 14
) => {
  const numbers = "1234567890";
  const symbols = "!@#$%^&*()_+{}[]|:;<>?";
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (includeNumbers) chars += numbers;
  if (includeSymbols) chars += symbols;

  let generatedPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    generatedPassword += chars[randomIndex];
  }
  return generatedPassword;
};
