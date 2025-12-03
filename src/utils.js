import { Auth } from "aws-amplify";
import { formatInTimeZone, format, toZonedTime } from "date-fns-tz";
import { createAuditLog } from "./components/service/userAdmin";
export const queryKeys = {
  adminsListing: "adminsListing",
  brokerSelectListing: "brokerSelectListing"
}
const months = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec"
};
export const INTERVALTIME = 300000;
export const FETCH_LIMIT = 100;

export const getFormattedDateTime = (lastLoginUTC) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = toZonedTime(new Date(lastLoginUTC), userTimeZone);
  const formattedDate = format(zonedDate, "MMM dd, yyyy HH:mm a", {
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

export const convertFromTimestamp = (timestamp, type) => {
  if (timestamp === null || timestamp === undefined || timestamp === "") return "";
  try {
    const tsNum = typeof timestamp === "string" ? Number(timestamp.trim()) : Number(timestamp);
    if (!Number.isFinite(tsNum)) return "";

    const ms = tsNum > 1e12 ? tsNum : tsNum * 1000;

    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) return "";

    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    switch(type) {
      case "dateTime":
      return formatInTimeZone(date, localTz, "MMM dd, yyyy hh:mm a");
      case "monthYear":
        return `${months[date.getMonth()]}, ${date.getFullYear()}`
      case "monthDateYear":
        return `${months[date.getMonth()]} ${date?.getDate()?.toString()?.padStart(2, "0")}, ${date.getFullYear()}`
      default:
        return ""
    }
  } catch (err) {
    return "";
  }
};