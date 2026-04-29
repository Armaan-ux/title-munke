import { Auth } from "aws-amplify";
import { formatInTimeZone, format, toZonedTime } from "date-fns-tz";
import { createAuditLog } from "./components/service/userAdmin";
export const queryKeys = {
  adminsListing: "adminsListing",
  brokerSelectListing: "brokerSelectListing",
  brokerListingForAdminDefault: "brokerListingForAdminDefault",
  brokerMetricsAdmin: "brokerMetricsAdmin",
  agentMetricsAdmin: "agentMetricsAdmin",
  brokersAgentListingAdmin: "brokersAgentListingAdmin",
  agentSearchesAdmin: "agentSearchesAdmin",
  individualListingForAdmin: "individualListingForAdmin",
  individualSearchesAdmin: "individualSearchesAdmin",
  getListDemoReqContacted: "getListDemoReqContacted",
  auditLogBroker: "auditLogBroker",
  auditLogAgent: "auditLogAgent",
  propertyDetail: "propertyDetail",
  getUserDetails: "getUserDetails",
  listTotalSearchesByUserId: "listTotalSearchesByUserId",
  listTotalAuditLogsByUserId: "listTotalAuditLogsByUserId",
  listAuditLogsByUserId: "listAuditLogsByUserId",
  aiModelListing: "aiModelListing",
  defaultAiModel: "defaultAiModel",
  pricingListing: "pricingListing",
  orgListingForAdminDefault: "orgListingForAdminDefault",
};
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
  11: "Dec",
};
export const INTERVALTIME = 300000;
export const FETCH_LIMIT = 100;

export const getFormattedDateTime = (dateString) => {
  // Empty, null, undefined
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  // Invalid date
  if (isNaN(date.getTime())) return "N/A";

  return (
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
};

export const handleCreateAuditLog = async (
  action,
  detail,
  isAgent = false,
  userType,
) => {
  const user = await Auth.currentAuthenticatedUser();
  const userId = user?.attributes?.sub;
  const email = user?.attributes?.email;
  await createAuditLog(
    userId,
    email,
    action,
    JSON.stringify(detail),
    isAgent,
    userType,
  );
};

export const convertFromTimestamp = (timestamp, type) => {
  if (timestamp === null || timestamp === undefined || timestamp === "")
    return "";
  try {
    const tsNum =
      typeof timestamp === "string"
        ? Number(timestamp.trim())
        : Number(timestamp);
    if (!Number.isFinite(tsNum)) return "";

    const ms = tsNum > 1e12 ? tsNum : tsNum * 1000;

    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) return "";

    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    switch (type) {
      case "dateTime":
        return formatInTimeZone(date, localTz, "MMM dd, yyyy hh:mm a");
      case "monthYear":
        return `${months[date.getMonth()]}, ${date.getFullYear()}`;
      case "monthDateYear":
        return `${months[date.getMonth()]} ${date?.getDate()?.toString()?.padStart(2, "0")}, ${date.getFullYear()}`;
      default:
        return "";
    }
  } catch (err) {
    return "";
  }
};
