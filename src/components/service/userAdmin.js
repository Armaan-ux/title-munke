import { API, Auth } from "aws-amplify";
import { constants } from "buffer";
import path from "path";
import { triggerLogout } from "@/utils/logoutManager";
// const apiName = 'usersAdmin-dev';
const apiName = "usersAdmin-dev";
const userPath = "/users";
const forgotPasswordPath = "/forgot-password";

// const token = (await Auth.currentSession()).getIdToken().getJwtToken();

// console.log("token===>", token);
export const CONSTANTS = {
  // should always be copied from title-munke-serverless code
  ACTIONS: {
    REINVITE: "reinvite",
    GET_AGENTS_TOTAL_SEARCHES_FOR_BROKER: "getAgentsTotalSearchesForBroker",
    GET_ADMIN_DETAILS: "getAdminDetails",
    GET_AGENT_DETAILS: "getAgentDetails",
    GET_BROKER_DETAILS: "getBrokerDetails",
    GET_BROKER_AGENTS_DETAILS: "getBrokerAgentsDetails",
    GET_TOTAL_ACTIVE_BROKERS: "getTotalActiveBrokers",
    GET_ACTIVE_BROKERS: "getActiveBrokers",
    GET_BROKER_SEARCHES: "getBrokerSearches",
    GET_BROKERS_WITH_SEARCH_COUNT: "getBrokersWithSearchCount",
    GET_TOTAL_BROKERS: "getTotalBrokers",
    LIST_BROKERS: "listBrokers",
    LIST_ADMINS: "listAdmins",
    UPDATE_ADMIN: "updateAdmin",
    UPDATE_BROKER_STATUS: "updateBrokerStatus",
    UPDATE_BROKER: "updateBroker",
    GET_TOTAL_BROKER_SEARCHES_THIS_MONTH: "getTotalBrokerSearchesThisMonth",
    GET_AGENT_TOTAL_SEARCHES_THIS_MONTH: "getAgentTotalSearchesThisMonth",
    ASSIGN_AGENT: "assignAgent",
    UNASSIGN_AGENT: "unassignAgent",
    GET_UNASSIGNED_AGENTS: "getUnassignedAgents",
    GET_PENDING_AGENT_SEARCHES: "getPendingAgentSearches",
    GET_TOP_PERFORMER_AGENT: "getTopPerformerAgent",
    GET_AGENT_DETAILS_AND_BROKER: "getAgentDetailsAndBroker",
    UPDATE_AGENT_STATUS: "updateAgentStatus",
    UPDATE_AGENT: "updateAgent",
    INITIATE_SEARCH: "InitiateSearch",
    TITLE_SEARCH: "TitleSearch",
    SEND_EMAIL_MESSAGE: "SendEmailMessage",
    CREATE_SEARCH_HISTORY: "CreateSearchHistory",
    LIST_SEARCH_HISTORIES: "listSearchHistories",
    UPDATE_SEARCH_HISTORY: "updateSearchHistory",
    GET_SEARCH_STATUS: "GetSearchStatus",
    FORGOT_PASSWORD: "ForgotPassword",
    DELETE_USER: "DeleteUser",
    UNDELETE_USER: "UndeleteUser",
    CREATE_AUDIT_LOG: "CreateAuditLog",
    LIST_AUDIT_LOGS: "listAuditLogs",

    REGISTER_USER: "RegisterUser",
    CONFIRM_EMAIL: "ConfirmEmail",
    RESEND_CONFIRMATION_CODE: "ResendConfirmationCode",

    PURCHASE_MEMBERSHIP: "subscribe",
    LIST_INVOICE: "listinvoice",
    MEMBERSHIP_DETAIL: "subscription-details",
    UPDATE_SUBSCRIPTION_STATUS: "update-subscription-status",
    GET_AGENT_SEARCHES: "getAgentSearches",
    GET_HOME: "get-home",
    LIST_DEMO_REQUEST: "listDemoRequest",
    CREATE_DEMO_REQUEST: "CreateDemoRequest",
    LIST_AGENTS: "listAgents",
    LIST_BROKER_WITH_NAME: "listBrokerWithName",
    LIST_INDIVIDUALS: "listIndividuals",
    INDIVIDUAL_SEARCHES: "getIndividualSearches",
    INDIVIDUAL_DETAILS: "getIndividualDetails",
    DEMO_REQUEST_MARK_CONTACTED: "MarkContacted",
    LIST_AUDIT_LOG_FOR_BROKER: "listAuditLogsForBroker",
    updateProfileDetails: "updateProfileDetails",
    uploadProfileImageOnS3: "uploadProfileImageOnS3",
    UPDATE_USER_STATUS: "updateUserStatusCommon",
    ADD_BROKER_BULK: "add-broker-bulk",
    LIST_TOTAL_SEARCHES_BY_USER_ID: "listTotalSearchesByUserId",
    LIST_TOTAL_AUDIT_LOGS_BY_USER_ID: "listTotalAuditLogsByUserId",
    LIST_AUDIT_LOGS_BY_USER_ID: "listAuditLogsByUserId",
    DELETE_STRIPE_CARD: "deleteStripeCard",
    EMAIL_PREFERENCE_WEEKLY_REPORT: "emailPreferenceWeeklyReport",
    MARK_DEFAULT_PAYMENT_METHOD: "markDefaultPaymentMethod",
    FETCH_EMAIL_PREFERENCE: "fetchEmailPreference",
    EMAIL_PREFERENCE_SEARCH_COMPLETE: "emailPreferenceSearchComplete",
    ADD_BULK_AGENTS: "addBulkAgents",
    ADD_BULK_BROKER: "addBulkBrokers",
    CHANGE_PASSWORD_OF_USER: "changePasswordOfUser",
    LIST_REQUESTS_BY_USER_ID: "listRequestsByUserId",
    DELETE_PRODUCT: "DeleteProduct",
    DEACTIVATE_PRICE: "deactivatePrice",
    PRODUCT_DETAILS: "productDetails",
  },
  USER_TYPES: {
    AGENT: "agent",
    BROKER: "broker",
    ADMIN: "admin",
    INDIVIDUAL: "individual",
  },
  USER_STATUS: {
    UNCONFIRMED: "UNCONFIRMED",
    FORCE_CHANGE_PASSWORD: "FORCE_CHANGE_PASSWORD",
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    DELETED: "DELETED",
  },
};

async function getAuthToken() {
  try {
    return (await Auth?.currentSession())?.getIdToken()?.getJwtToken();
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}
async function getAccessToken() {
  try {
    return (await Auth?.currentSession())?.getAccessToken()?.getJwtToken();
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}
async function callGetUserAdminApi(
  payload,
  successMessage,
  errorMessage,
  path = userPath,
) {
  try {
    const token = await getAuthToken();
    const accessToken = await getAccessToken();

    const params = {
      headers: payload.headers || {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(accessToken ? { "X-Access-Token": accessToken } : {}),
      },

      // 👇 body keys converted to query params
      queryStringParameters: payload.body || {},
    };

    console.log("API GET Params:", params);

    const response = await API.get(apiName, path, params);

    console.log(successMessage, response);
    return response;
  } catch (error) {
    const errorData = error.response?.data || error;
    const statusCode = error?.response?.status || error?.statusCode;
    if (statusCode === 401) {
      await triggerLogout();
    }
    console.error(errorMessage, errorData);
    throw error;
  }
}
async function callDeleteUserAdminApi(
  payload,
  successMessage,
  errorMessage,
  path = userPath,
) {
  try {
    const token = await getAuthToken();
    const accessToken = await getAccessToken();

    const params = {
      headers: payload.headers || {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(accessToken ? { "X-Access-Token": accessToken } : {}),
      },

      // ✅ SEND AS BODY
      body: payload.body || {},
    };

    console.log("API DELETE Params:", params);

    const response = await API.del(apiName, path, params);

    console.log(successMessage, response);
    return response;
  } catch (error) {
    const errorData = error.response?.data || error;
    console.error(errorMessage, errorData);
    throw error;
  }
}
async function callUserAdminApi(
  payload,
  successMessage,
  errorMessage,
  path = userPath,
) {
  try {
    // The Amplify API library automatically looks up the endpoint from aws-exports.js
    // and, most importantly, signs the request with the current user's credentials.
    const isFormData = payload.body instanceof FormData;
    const token = await getAuthToken();
    const accessToken = await getAccessToken();
    const params = {
      ...payload,
      headers: payload.headers || {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(accessToken ? { "X-Access-Token": `${accessToken}` } : {}),
      },
    };
    console.log("API Call Params:", params);
    const response = await API.post(apiName, path, params);
    console.log(successMessage, response);
    return response;
  } catch (error) {
    // Improved error logging to show server-side error messages if available
    const errorData = error.response ? error.response.data : error;
    const statusCode = error?.response?.status || error?.statusCode;
    if (statusCode === 401) {
      await triggerLogout();
    }
    console.error(errorMessage, errorData);
    throw error; // Re-throw to allow calling functions to handle if needed
  }
}
async function callPutUserAdminApi(
  payload,
  successMessage,
  errorMessage,
  path = userPath,
) {
  try {
    // The Amplify API library automatically looks up the endpoint from aws-exports.js
    // and, most importantly, signs the request with the current user's credentials.
    const isFormData = payload.body instanceof FormData;
    const token = await getAuthToken();
    const accessToken = await getAccessToken();
    const params = {
      ...payload,
      headers: payload.headers || {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(accessToken ? { "X-Access-Token": `${accessToken}` } : {}),
      },
    };
    console.log("API Call Params:", params);
    const response = await API.put(apiName, path, params);
    console.log(successMessage, response);
    return response;
  } catch (error) {
    // Improved error logging to show server-side error messages if available
    const errorData = error.response ? error.response.data : error;
    const statusCode = error?.response?.status || error?.statusCode;
    if (statusCode === 401) {
      await triggerLogout();
    }
    console.error(errorMessage, errorData);
    throw error; // Re-throw to allow calling functions to handle if needed
  }
}

// Refactored to a single helper to reduce duplication
async function createUser(userData) {
  return callUserAdminApi(
    { body: userData },
    "Successfully created user:",
    "Error creating user:",
    "/add-user-common",
  );
}

export async function createAgentOnCognito(name, email, searchLimit, brokerId) {
  return createUser({
    name,
    userType: CONSTANTS.USER_TYPES.AGENT,
    email,
    brokerId,
    searchLimit,
  });
}

export async function createBrokerOnCognito(name, email) {
  return createUser({ name, userType: CONSTANTS.USER_TYPES.BROKER, email });
}

export async function createAdminOnCognito(name, email) {
  return createUser({ name, userType: CONSTANTS.USER_TYPES.ADMIN, email });
}

export async function reinviteAgent(email) {
  const payload = {
    body: {
      email: email,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in reinviteUser:",
    "Error in reinviteUser:",
    "/reinvite",
  );
}

export async function forgotPassword(email) {
  const payload = {
    body: {
      email: email,
    },
    // headers: {Authorization: "", "Content-Type": "application/json"},
  };

  return callUserAdminApi(
    payload,
    "Success in forgotPassword:",
    "Error in forgotPassword:",
    "/forgot-password",
  );
}

export async function getBrokerAgentsDetails(
  brokerId,
  withSearchCount = false,
  fromDatetime,
  toDatetime,
) {
  const payload = {
    body: {
      brokerId: brokerId,
      withSearchCount: withSearchCount,
      ...(fromDatetime && { fromDatetime }),
      ...(toDatetime && { toDatetime }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getBrokerAgentsDetails:",
    "Error in getBrokerAgentsDetails:",
    "/get-broker-agent-details",
  );
}
export async function getOrganisationBrokerDetails(
  organisationId,
  withSearchCount = false,
  fromDatetime,
  toDatetime,
) {
  const payload = {
    body: {
      organisationId: organisationId,
      withSearchCount: withSearchCount,
      ...(fromDatetime && { fromDatetime }),
      ...(toDatetime && { toDatetime }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getOrganisationBrokerDetails:",
    "Error in getOrganisationBrokerDetails:",
    "/get-organisation-broker-details",
  );
}
export async function getOrganisationAgentDetails(
  organisationId,
  withSearchCount = false,
  fromDatetime,
  toDatetime,
) {
  const payload = {
    body: {
      organisationId: organisationId,
      withSearchCount: withSearchCount,
      ...(fromDatetime && { fromDatetime }),
      ...(toDatetime && { toDatetime }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getOrganisationAgentDetails:",
    "Error in getOrganisationAgentDetails:",
    "/get-organisation-agent-details",
  );
}




export async function getBrokerDetails(brokerId) {
  const payload = {
    body: {
      brokerId: brokerId,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getBrokerDetails:",
    "Error in getBrokerDetails:",
    "/get-broker-details",
  );
}

export async function getAgentDetails(agentId) {
  const payload = {
    body: {
      agentId: agentId,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getAgentDetails:",
    "Error in getAgentDetails:",
    "/get-agent-details",
  );
}
export async function getOrganisationDetails(organisationId) {
  const payload = {
    body: {
      organisationId: organisationId,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getOrganisationDetails:",
    "Error in getOrganisationDetails:",
    "/get-organisation-details",
  );
}

export async function getAdminDetails(adminId) {
  const payload = {
    body: {
      adminId: adminId,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getAdminDetails:",
    "Error in getAdminDetails:",
    "/get-admin-details",
  );
}

export async function getAgentsTotalSearches(
  brokerId,
  fromDatetime,
  toDatetime,
) {
  console.log({ fromDatetime, toDatetime });
  const payload = {
    body: {
      brokerId: brokerId,
      ...(fromDatetime && { fromDatetime: fromDatetime }),
      ...(toDatetime && { toDatetime: toDatetime }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getAgentsTotalSearches:",
    "Error in getAgentsTotalSearches:",
    "/get-agent-total-searches-for-broker",
  );
}

export async function getBrokerTotalSearches(
  brokerId,
  fromDatetime,
  toDatetime,
) {
  const payload = {
    body: {
      brokerId: brokerId,
      ...(fromDatetime && { fromDatetime: fromDatetime }),
      ...(toDatetime && { fromDatetime: toDatetime }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getBrokerTotalSearches:",
    "Error in getBrokerTotalSearches:",
    "/get-broker-searches",
  );
}

export async function getBrokersWithSearchCount(nextToken) {
  const payload = {
    body: {
      nextToken: nextToken,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getBrokersWithSearchCount:",
    "Error in getBrokersWithSearchCount:",
    "/get-broker-with-search-count",
  );
}

export async function getTotalBrokers() {
  const payload = {
    body: {},
  };
  return callGetUserAdminApi(
    payload,
    "Success in getTotalBrokers:",
    "Error in getTotalBrokers:",
    "/get-total-brokers",
  );
}

export async function updateBrokerStatus(brokerId, status) {
  const payload = {
    body: {
      brokerId: brokerId,
      status: status,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in updateBrokerStatus:",
    "Error in updateBrokerStatus:",
    "/update-broker-status",
  );
}

export async function updateBroker(brokerId, input) {
  const payload = {
    body: {
      brokerId: brokerId,
      input: input,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in updateBroker:",
    "Error in updateBroker:",
    "/update-broker",
  );
}

export async function updateAgent(agentId, input) {
  const payload = {
    body: {
      agentId: agentId,
      input: input,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in updateAgent:",
    "Error in updateAgent:",
    "/update-agent",
  );
}

export async function updateAdmin(adminId, input) {
  const payload = {
    body: {
      adminId: adminId,
      input: input,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in updateAdmin:",
    "Error in updateAdmin:",
    "/update-admin",
  );
}

export async function getTotalBrokerSearchesThisMonth() {
  const payload = {
    body: {},
  };
  return callGetUserAdminApi(
    payload,
    "Success in getTotalBrokerSearchesThisMonth:",
    "Error in getTotalBrokerSearchesThisMonth:",
    "/get-total-broker-searches-this-month",
  );
}

export async function getAgentTotalSearchesThisMonth(agentId) {
  const payload = {
    body: {
      agentId: agentId,
    },
  };
  const data = await callGetUserAdminApi(
    payload,
    "Success in getAgentTotalSearchesThisMonth:",
    "Error in getAgentTotalSearchesThisMonth:",
    "/get-agent-total-searches-this-month",
  );
  return data.totalSearches;
}

export async function getPendingAgentSearches(
  brokerId,
  fromDatetime,
  toDatetime,
) {
  const payload = {
    body: {
      brokerId: brokerId,
      fromDatetime: fromDatetime,
      toDatetime: toDatetime,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getPendingAgentSearches:",
    "Error in getPendingAgentSearches:",
    "/get-pending-agent-searches",
  );
}

export async function getUnassignedAgents() {
  const payload = {
    body: {},
  };
  return callGetUserAdminApi(
    payload,
    "Success in getUnassignedAgents:",
    "Error in getUnassignedAgents:",
    "/get-unassigned-agents",
  );
}

export async function listAdmins(nextToken) {
  const payload = {
    body: {
      nextToken,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in listAdmins:",
    "Error in listAdmins:",
    "/list-admins",
  );
}


export async function listBrokers(data) {
  const { withSearchCount, limit } = data || {};
  const payload = {
    body: {
      ...(limit && { limit }),
      ...(withSearchCount && { withSearchCount }),
      ...(data?.from && { fromDatetime: data.from }),
      ...(data?.to && { toDatetime: data.to }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in listBrokers:",
    "Error in listBrokers:",
    "/list-brokers",
  );
}

export async function getTopPerformerAgent(brokerId) {
  const payload = {
    body: {
      brokerId: brokerId,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getTopPerformerAgent:",
    "Error in getTopPerformerAgent:",
    "/get-top-performer-agent",
  );
}

export async function UnassignAgent(agentId) {
  const payload = {
    body: {
      agentId: agentId,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in UnassignAgent:",
    "Error in UnassignAgent:",
  );
}

export async function assignAgent(agentId, name, brokerId) {
  const payload = {
    body: {
      agentId: agentId,
      name: name,
      brokerId: brokerId,
      action: CONSTANTS.ACTIONS.ASSIGN_AGENT,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in assignAgent:",
    "Error in assignAgent:",
    "/assign-agent",
  );
}

export async function updateAgentStatus(agentId, status) {
  const payload = {
    body: {
      agentId: agentId,
      status: status,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in updateAgentStatus:",
    "Error in updateAgentStatus:",
    "/update-agent-status",
  );
}

export async function getActiveBrokers() {
  const payload = {
    body: {},
  };
  return callGetUserAdminApi(
    payload,
    "Success in getActiveBrokers:",
    "Error in getActiveBrokers:",
    "/get-active-brokers",
  );
}

export async function createSearchHistoryForUser(
  userId,
  userType,
  address,
  searchId,
  status,
  downloadLink,
) {
  const payload = {
    body: {
      userId: userId,
      userType: userType,
      address: address,
      status: status,
      searchId: searchId,
      downloadLink: downloadLink,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in createSearchHistoryForUser:",
    "Error in createSearchHistoryForUser:",
    "/create-search-history",
  );
}

export async function updateSearchHistory(id, status, downloadLink) {
  const payload = {
    body: {
      input: {
        id: id,
        status: status,
        downloadLink: downloadLink,
      },
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in updateSearchHistory:",
    "Error in updateSearchHistory:",
    "/update-search-history",
  );
}

export async function getSearchStatus(searchId) {
  const payload = {
    body: {
      searchId: searchId,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getSearchStatus:",
    "Error in getSearchStatus:",
    "/get-search-status",
  );
}

export async function listSearchHistories({
  userType,
  brokerId,
  userId,
  nextToken,
}) {
  const payload = {
    body: {
      userType,
      brokerId,
      userId,
      nextToken,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in listSearchHistories:",
    "Error in listSearchHistories:",
    "/list-search-histories",
  );
}

export async function listAuditLogs(activeTab, userIds, nextToken) {
  const payload = {
    body: {
      userType: activeTab,
      ...(userIds && { userIds: userIds }),
      ...(nextToken && { nextToken: nextToken }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in listAuditLogs:",
    "Error in listAuditLogs:",
    "/list-audit-logs",
  );
}

export async function initiateSearch(pin, parnum, address, tax_assessment) {
  const payload = {
    body: {
      pin: pin,
      parnum: parnum,
      address: address,
      tax_assessment: tax_assessment,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in initiateSearch:",
    "Error in initiateSearch:",
    "/initiate-search",
  );
}

export async function titleSearch(address) {
  const payload = {
    body: {
      address: address,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in titleSearch:",
    "Error in titleSearch:",
    "/title-search",
  );
}

export async function sendEmailMessage(name, email, subject, detail) {
  const payload = {
    body: {
      name: name,
      email: email,
      subject: subject,
      detail: detail,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in sendEmailMessage:",
    "Error in sendEmailMessage:",
    "/send-email-message",
  );
}

export async function deleteUser(userId, email, userType) {
  const payload = {
    body: {
      userId: userId,
      email: email,
      userType: userType,
      action: CONSTANTS.ACTIONS.DELETE_USER,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in deleteUser:",
    "Error in deleteUser:",
  );
}

export async function undeleteUser(userId, email, userType) {
  const payload = {
    body: {
      userId: userId,
      email: email,
      userType: userType,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in undeleteUser:",
    "Error in undeleteUser:",
  );
}

export async function createAuditLog(
  userId,
  email,
  log_action,
  detail,
  isAgent,
  userType,
) {
  const payload = {
    body: {
      userId: userId,
      email: email,
      log_action: log_action,
      detail: detail,
      isAgent: isAgent,
      userType: userType,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in createAuditLog:",
    "Error in createAuditLog:",
    "/create-audit-log",
  );
}

export async function registerUser({
  name,
  email,
  phoneNumber,
  password,
  userType,
  planType,
  teamStrength = 10,
}) {
  const body = {
    name,
    emailOfUser: email,
    password,
    userType,
    teamStrength,
  };

  if (phoneNumber) body.phoneNumber = phoneNumber;
  if (planType) body.planType = planType;

  console.log("Register User Payload:", body);

  const payload = {
    body,
    headers: {
      Authorization: "",
      "Content-Type": "",
    },
  };
  return callUserAdminApi(
    payload,
    "Success in registerUser:",
    "Error in registerUser:",
    "/register-user",
  );
}

export async function confirmEmail({ code, email, userType }) {
  const payload = {
    body: {
      code: code,
      emailOfUser: email,
      userType: userType,
    },
    headers: { Authorization: "", "Content-Type": "" },
  };
  return callUserAdminApi(
    payload,
    "Success in confirmCode:",
    "Error in confirmCode:",
    "/confirm-email",
  );
}

export async function resendConfirmationCode(email) {
  const payload = {
    body: {
      emailOfUser: email,
    },
    headers: { Authorization: "", "Content-Type": "" },
  };
  return callUserAdminApi(
    payload,
    "Success in resendConfirmationCode:",
    "Error in resendConfirmationCode:",
    "/resend-confirmation-code",
  );
}

export async function addCard(
  userId,
  userType,
  endpoint,
  planId,
  actionType,
  agent,
) {
  const payload = {
    body: {
      // email: email,
      userId,
      userType,
      ...(planId && { planType: planId }),
      ...(actionType && { actionType }),
      ...(agent && { agentCount: agent }),
    },
  };
  return callUserAdminApi(
    payload,
    "Success in subscriber:",
    "Error in subscriber:",
    `/${endpoint}`,
  );
}

export async function getSubscriptionDetails(userId, userType) {
  const payload = {
    body: {
      // email: email,
      userId,
      userType,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in subscriber:",
    "Error in subscriber:",
    "/subscription-details",
  );
}

export async function getInvoice(userId, userType) {
  const payload = {
    body: {
      userId,
      userType,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Successs in listinvoice",
    "Error in listinvoice",
    "/list-invoice",
  );
}

export async function cancelSubscription(userId, userType, isCancel, reason) {
  const action = CONSTANTS?.ACTIONS?.UPDATE_SUBSCRIPTION_STATUS;
  const payload = {
    body: {
      userId,
      userType,
      cancel_at_period_end: isCancel,
      reason,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/update-subscription-status",
  );
}

export async function getSearchedStatus(searchId) {
  const action = CONSTANTS?.ACTIONS?.GET_SEARCH_STATUS;
  const payload = {
    body: {
      searchId,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/get-search-status",
  );
}
export async function updateStatus(agentId) {
  const action = CONSTANTS?.ACTIONS?.UPDATE_AGENT_STATUS;
  const payload = {
    body: {
      status: "ACTIVE",
      action,
      agentId,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/users",
  );
}
export async function getAgentBrokerDetails(agentId) {
  const action = CONSTANTS?.ACTIONS?.GET_AGENT_DETAILS;
  const payload = {
    body: {
      agentId,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/get-agent-details",
  );
}
export async function getAgentSearches(agentId, fromDatetime, toDatetime) {
  const action = CONSTANTS?.ACTIONS?.GET_AGENT_SEARCHES;
  const payload = {
    body: {
      agentId,
      ...(fromDatetime && { fromDatetime }),
      ...(toDatetime && { toDatetime }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/get-agent-searches",
  );
}
export async function getAdminMetrics(data) {
  const action = CONSTANTS?.ACTIONS?.GET_HOME;
  const payload = {
    body: {
      ...data,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/get-home",
  );
}
export async function getListDemoReq(type) {
  const action = CONSTANTS?.ACTIONS?.LIST_DEMO_REQUEST;
  const payload = {
    body: {
      ...(type && { type }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/list-demo-request",
  );
}

export async function demoRequest(demoData) {
  const action = CONSTANTS?.ACTIONS?.CREATE_DEMO_REQUEST;
  const payload = {
    body: {
      ...demoData,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/create-demo-request",
  );
}
export async function getAgentListings(nextToken) {
  const action = CONSTANTS?.ACTIONS?.LIST_AGENTS;
  const payload = {
    body: {
      nextToken,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/list-agents",
  );
}
export async function getBrokerSelectListing() {
  const action = CONSTANTS?.ACTIONS?.LIST_BROKER_WITH_NAME;
  const payload = {
    body: {
      action,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/list-broker-name",
  );
}
export async function createUserByAdmin(newUserData) {
  // const action = CONSTANTS?.ACTIONS?.LIST_BROKER_WITH_NAME
  const payload = {
    body: {
      ...newUserData,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in ",
    "error in ",
    "/add-user-common",
  );
}

export async function updateBrokerDetail(updatedData) {
  const action = CONSTANTS?.ACTIONS?.UPDATE_BROKER;
  const payload = {
    body: {
      action,
      input: updatedData,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/users",
  );
}

export async function updateAgentDetail(updatedData) {
  const action = CONSTANTS?.ACTIONS?.UPDATE_AGENT;
  const payload = {
    body: {
      input: updatedData,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/update-agent",
  );
}
export async function updateAdminDetail(updatedData) {
  const action = CONSTANTS?.ACTIONS?.UPDATE_ADMIN;
  const payload = {
    body: {
      action,
      input: updatedData,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/users",
  );
}
export async function deleteUserNew(userDta) {
  const action = CONSTANTS?.ACTIONS?.DELETE_USER;
  const payload = {
    body: {
      ...userDta,
    },
  };
  return callDeleteUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/delete-user",
  );
}
export async function restoreUser(userData) {
  const action = CONSTANTS?.ACTIONS?.UNDELETE_USER;
  const payload = {
    body: {
      ...userData,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/undelete-user",
  );
}
export async function reinviteUser(userDta) {
  const action = CONSTANTS?.ACTIONS?.REINVITE;
  const payload = {
    body: {
      ...userDta,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/reinvite",
  );
}

export async function getIndividualListing(
  withSearchCount,
  limit,
  fromDatetime,
  toDatetime,
) {
  const action = CONSTANTS?.ACTIONS?.LIST_INDIVIDUALS;
  const payload = {
    body: {
      ...(limit && { limit }),
      ...(fromDatetime && { fromDatetime }),
      ...(toDatetime && { toDatetime }),
      withSearchCount,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/list-individuals",
  );
}
export async function getIndividualSearches(userId, fromDatetime, toDatetime) {
  const action = CONSTANTS?.ACTIONS?.INDIVIDUAL_SEARCHES;
  const payload = {
    body: {
      userId,
      ...(fromDatetime && { fromDatetime }),
      ...(toDatetime && { toDatetime }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/get-individual-searches",
  );
}
export async function getIndividualDetails(userId) {
  const action = CONSTANTS?.ACTIONS?.INDIVIDUAL_DETAILS;
  const payload = {
    body: {
      userId,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/get-agent-details-for-admin",
  );
}
export async function markDemoRequestContacted(requestId) {
  const action = CONSTANTS?.ACTIONS?.DEMO_REQUEST_MARK_CONTACTED;
  const payload = {
    body: {
      requestId,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/mark-contacted",
  );
}
export async function getAuditLogsForBroker(brokerId, isAgent) {
  const action = CONSTANTS?.ACTIONS?.LIST_AUDIT_LOG_FOR_BROKER;
  const payload = {
    body: {
      userId: brokerId,
      isAgent,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/list-audit-logs-for-broker",
  );
}
export async function updateProfileDetails(data) {
  const action = CONSTANTS?.ACTIONS?.updateProfileDetails;
  const payload = {
    body: {
      ...data,
      emailOfUser: data?.email,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/update-profile-details",
  );
}
export async function uploadProfileImageOnS3(data) {
  const action = CONSTANTS?.ACTIONS?.uploadProfileImageOnS3;
  const payload = {
    body: {
      ...data,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/upload-profile-image-on-s3",
  );
}

export async function updateUserStatus(data) {
  const action = CONSTANTS?.ACTIONS?.UPDATE_USER_STATUS;
  const payload = {
    body: {
      ...data,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/update-user-status-common",
  );
}

export async function bulkAgentUpload(data) {
  const action = CONSTANTS?.ACTIONS?.ADD_BULK_AGENTS;

  const payload = {
    body: { ...data },
  };

  return callUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/add-bulk-agents",
  );
}
export async function bulkBrokerUpload(data) {
  const action = CONSTANTS?.ACTIONS?.ADD_BULK_BROKER;

  const payload = {
    body: { ...data },
  };

  return callUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/add-bulk-brokers",
  );
}

export async function listTotalAuditLogsByUserId(userId) {
  const action = CONSTANTS?.ACTIONS?.LIST_TOTAL_AUDIT_LOGS_BY_USER_ID;

  const payload = {
    body: {
      userId,
    },
  };

  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/list-total-audit-logs-by-user-id",
  );
}
export async function listTotalSearchesByUserId(userId) {
  const action = CONSTANTS?.ACTIONS?.LIST_TOTAL_SEARCHES_BY_USER_ID;

  const payload = {
    body: {
      userId,
    },
  };

  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/list-total-searches-by-user-id",
  );
}

export async function listAuditLogsByUserId(userId) {
  const action = CONSTANTS?.ACTIONS?.LIST_AUDIT_LOGS_BY_USER_ID;

  const payload = {
    body: {
      userId,
    },
  };

  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/list-audit-logs-by-user-id",
  );
}

export async function deleteStripeCard(pmId) {
  const action = CONSTANTS?.ACTIONS?.DELETE_STRIPE_CARD;

  const payload = {
    body: {
      paymentMethodId: pmId,
    },
  };

  return callDeleteUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/delete-stripe-card",
  );
}

export async function emailPreferenceWeeklyReport(emailPreference) {
  // will recevie true or false only
  const action = CONSTANTS?.ACTIONS?.EMAIL_PREFERENCE_WEEKLY_REPORT;

  const payload = {
    body: {
      emailPreference,
    },
  };

  return callUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/email-preference-weekly-report",
  );
}

export async function emailPreferenceSearchComplete(emailPreference) {
  // will recevie true or false only
  const action = CONSTANTS?.ACTIONS?.EMAIL_PREFERENCE_SEARCH_COMPLETE;

  const payload = {
    body: {
      emailPreference,
    },
  };

  return callUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/email-preference-search-complete",
  );
}

export async function markDefaultPaymentMethod(pmId) {
  const action = CONSTANTS?.ACTIONS?.MARK_DEFAULT_PAYMENT_METHOD;

  const payload = {
    body: {
      paymentMethodId: pmId,
    },
  };

  return callUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/mark-default-payment-method",
  );
}

export async function fetchEmailPreference() {
  const action = CONSTANTS?.ACTIONS?.FETCH_EMAIL_PREFERENCE;

  const payload = {
    body: {},
  };

  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/fetch-email-preference",
  );
}

export async function changePassword(data) {
  const action = CONSTANTS?.ACTIONS?.CHANGE_PASSWORD_OF_USER;

  const payload = {
    body: {
      ...data,
    },
  };

  return callUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/change-password-of-user",
  );
}

export async function iniitateSearch(data) {
  const action = "INITIATE_SEARCH";

  const payload = {
    body: {
      ...data,
    },
  };

  return callUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/initiate-search",
  );
}

export async function listRequestByUserId(requestType) {
  const action = CONSTANTS?.ACTIONS?.LIST_REQUESTS_BY_USER_ID;

  const payload = {
    body: {
      requestType,
    },
  };

  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/request-fetch-of-user",
  );
}

export async function getBrokerAndOrganizationSelectListing(actionType) {
  const payload = actionType ? { body: { actionType: actionType } } : {};
  return callGetUserAdminApi(
    payload,
    "Success in getBrokerAndOrganizationSelectListing:",
    "Error in getBrokerAndOrganizationSelectListing:",
    "/fetch-existing-user-listing-to-join",
  );
}

export async function addRequestToJoinUser(userData) {
  return callUserAdminApi(
    { body: userData },
    "Successfully joined user:",
    "Error joining user:",
    "/add-request-to-join-user",
  );
}
export async function cancelRequestToJoinUser(userData) {
  return callUserAdminApi(
    { body: userData },
    "Successfully cancelled request:",
    "Error cancelling request:",
    "/add-request-to-leave-user",
  );
}
export async function withdrawRequestToJoinUser(userData) {
  return callUserAdminApi(
    { body: userData },
    "Successfully withdrawn request:",
    "Error withdrawing request:",
    "/withdraw-request-to-join-user",
  );
}
export async function processRequestToJoinUser(userData) {
  return callUserAdminApi(
    { body: userData },
    "Successfully processed request:",
    "Error processing request:",
    "/process-request-to-join-user",
  );
}
export async function processLeaveRequestToJoinUser(userData) {
  return callUserAdminApi(
    { body: userData },
    "Successfully processed request:",
    "Error processing request:",
    "/process-request-to-leave-user",
  );
}

export async function changePlanOfUser(newPlanType) {
  return callUserAdminApi(
    { body: newPlanType },
    "Successfully processed request:",
    "Error processing request:",
    "/change-plan-of-user",
  );
}
export async function createAgentfromSignup(data) {
  const {
    name,
    email,
    phoneNumber,
    searchLimit,
    userType,
    brokerId,
    planType,
    organisationId,
    actionType,
    customUUID,
  } = data;

  return createUser({
    name,
    email,
    phoneNumber,
    userType,
    planType,
    ...(brokerId && { brokerId }),
    ...(searchLimit && { searchLimit }),
    ...(organisationId && { organisationId }),
    ...(actionType && { actionType }),
    ...(customUUID && { customUUID }),
  });
}

export async function getCheckCardIsAdded() {
  const payload = {};
  return callGetUserAdminApi(
    payload,
    "Success in getCheckCardIsAdded",
    "Error in getCheckCardIsAdded",
    "/check-if-card-added-of-user",
  );
}
export async function updateStatusAgent(agentId) {
  const action = CONSTANTS?.ACTIONS?.UPDATE_AGENT_STATUS;
  const payload = {
    body: {
      status: "ACTIVE",
      action,
      agentId,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/update-agent-status",
  );
}
export async function getOrganisationMetrics(data) {
  const action = CONSTANTS?.ACTIONS?.GET_HOME;
  const payload = {
    body: {
      ...data,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/get-dashboard-stats-org",
  );
}

export async function listAuditLogsOrg(
  logType,
  userIds,
  nextToken,
  limit = 10,
) {
  const payload = {
    body: {
      logType: logType,
      ...(userIds && { userIds: userIds }),
      ...(nextToken && { nextToken: nextToken }),
      limit,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in listAuditLogs:",
    "Error in listAuditLogs:",
    "/list-audit-logs-for-org",
  );
}
export async function getOrgBrokersList(data) {
  const { nextToken = null, withSearchCount, limit } = data || {};
  const payload = {
    body: {
      ...(nextToken && { nextToken }),
      ...(limit && { limit }),
      ...(withSearchCount && { withSearchCount }),
      ...(data?.from && { fromDatetime: data.from }),
      ...(data?.to && { toDatetime: data.to }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getBrokersWithSearchCount:",
    "Error in getBrokersWithSearchCount:",
    "/list-brokers-for-org",
  );
}
export async function getOrgAgentsList(data) {
  const { nextToken = null, withSearchCount, limit } = data || {};
  const payload = {
    body: {
      ...(nextToken && { nextToken }),
      ...(limit && { limit }),
      ...(withSearchCount && { withSearchCount }),
      ...(data?.from && { fromDatetime: data.from }),
      ...(data?.to && { toDatetime: data.to }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in getAgentsWithSearchCount:",
    "Error in getAgentsWithSearchCount:",
    "/list-agents-for-org",
  );
}
export async function updateOrgBrokerDetail(updatedData) {
  const action = CONSTANTS?.ACTIONS?.UPDATE_BROKER;
  const payload = {
    body: {
      action,
      input: updatedData,
    },
  };
  return callPutUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/update-broker",
  );
}

export async function checkEmailExist({ email }) {
  return callUserAdminApi(
    { body: { emailOfUser: email } },
    "Successfully created user:",
    "Error creating user:",
    "/check-if-email-already-exist",
  );
}
export async function listPricing({ roleType, active }) {
  const action = CONSTANTS?.ACTIONS?.LIST_REQUESTS_BY_USER_ID;

  const payload = {
    body: {
      roleType,
      active,
    },
  };

  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/list-stripe-products",
  );
}

export async function createProduct(formData) {
  const payload = {
    body: formData,
  };
  return callUserAdminApi(
    payload,
    "Success in createProduct:",
    "Error in createProduct:",
    "/create-stripe-product",
  );
}
export async function createPrice(data) {
  const payload = {
    body: data,
  };
  return callUserAdminApi(
    payload,
    "Success in createPrice:",
    "Error in createPrice:",
    "/add-stripe-price",
  );
}
export async function updateProduct(formData) {
  const payload = {
    body: formData,
  };
  return callPutUserAdminApi(
    payload,
    "Success in updateProduct:",
    "Error in updateProduct:",
    "/edit-stripe-product",
  );
}
export async function deleteProduct(productId) {
  const action = CONSTANTS?.ACTIONS?.DELETE_PRODUCT;
  const payload = {
    body: {
      productId,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/archive-stripe-product",
  );
}
export async function deactivePrice(priceId, productType) {
  const action = CONSTANTS?.ACTIONS?.DEACTIVATE_PRICE;
  const payload = {
    body: {
      priceId,
      productType,
    },
  };
  return callUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/deactivate-stripe-price",
  );
}
export async function productDetails(productId) {
  const action = CONSTANTS?.ACTIONS?.PRODUCT_DETAILS;

  const payload = {
    body: {
      productId,
    },
  };

  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "Error in " + action,
    "/get-stripe-product",
  );
}

export async function listOrganisation(nextToken) {
  const payload = {
    body: {
      nextToken,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in listAdmins:",
    "Error in listAdmins:",
    "/get-organisation-with-search-count",
  );
}

export async function listOrganisations(data) {
  const { withSearchCount, limit } = data || {};
  const payload = {
    body: {
      ...(limit && { limit }),
      ...(withSearchCount && { withSearchCount }),
      ...(data?.from && { fromDatetime: data.from }),
      ...(data?.to && { toDatetime: data.to }),
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in listBrokers:",
    "Error in listBrokers:",
    "/get-organisation-with-search-count",
  );
}
export async function getAgentlListing(
  withSearchCount,
  limit,
  fromDatetime,
  toDatetime,
) {
  const action = CONSTANTS?.ACTIONS?.LIST_INDIVIDUALS;
  const payload = {
    body: {
      ...(limit && { limit }),
      ...(fromDatetime && { fromDatetime }),
      ...(toDatetime && { toDatetime }),
      withSearchCount,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in " + action,
    "error in " + action,
    "/list-agents-for-admin",
  );
}
export async function fetchBrokerInOrganisation() {
  const payload = {
    body: {},
  };
  return callGetUserAdminApi(
    payload,
    "Success in fetchBrokerInOrganisation:",
    "Error in fetchBrokerInOrganisation:",
    "/fetch-broker-in-organisation",
  );
}

export async function listStripeProductsForPricingPage(roleType) {
  const payload = {
    body: {
      roleType,
    },
  };
  return callGetUserAdminApi(
    payload,
    "Success in listStripeProductsForPricingPage:",
    "Error in listStripeProductsForPricingPage:",
    "/list-stripe-products-for-pricing-page",
  );
}
