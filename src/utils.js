import { API, Auth } from "aws-amplify";
import { createAuditLog } from "./graphql/mutations";
import { format, toZonedTime } from "date-fns-tz";
export const INTERVALTIME = 3000;
export const getFormattedDateTime = (lastLoginUTC) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const zonedDate = toZonedTime(new Date(lastLoginUTC), userTimeZone);
  const formattedDate = format(zonedDate, "yyyy-MM-dd HH:mm:ss", {
    timeZone: userTimeZone,
  });

  return formattedDate;
};

export const handleCreateAuditLog = async (action, detail) => {
  const user = await Auth.currentAuthenticatedUser();
  const input = {
    userId: user?.attributes?.sub,
    action,
    detail: JSON.stringify(detail),
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
