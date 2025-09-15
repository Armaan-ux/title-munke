import { Auth } from "aws-amplify";
import { format, toZonedTime } from "date-fns-tz";
import { createAuditLog } from "./components/service/userAdmin";

export const INTERVALTIME = 300000;
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
  const userId = user?.attributes?.sub;
  const email = user?.attributes?.email;
  await createAuditLog(userId, email, action, JSON.stringify(detail), isAgent);
};
