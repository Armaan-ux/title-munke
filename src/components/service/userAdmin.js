import { API } from 'aws-amplify';

const apiName = 'usersAdmin';
const path = '/users';

export const CONSTANTS = { // should always be copied from title-munke-serverless code
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
  },
  USER_TYPES: {
    AGENT: "agent",
    BROKER: "broker",
    ADMIN: "admin",
  },
  USER_STATUS: {
    UNCONFIRMED: "UNCONFIRMED",
    FORCE_CHANGE_PASSWORD: "FORCE_CHANGE_PASSWORD",
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    DELETED: "DELETED",
  }
};

async function callUserAdminApi(payload, successMessage, errorMessage) {
  try {
    // The Amplify API library automatically looks up the endpoint from aws-exports.js
    // and, most importantly, signs the request with the current user's credentials.
    const response = await API.post(apiName, path, payload);
    console.log(successMessage, response);
    return response;
  } catch (error) {
    // Improved error logging to show server-side error messages if available
    const errorData = error.response ? error.response.data : error;
    console.error(errorMessage, errorData);
    throw error; // Re-throw to allow calling functions to handle if needed
  }
}

// Refactored to a single helper to reduce duplication
async function createUser(userData) {
  return callUserAdminApi(
    { body: userData },
    'Successfully created user:',
    'Error creating user:'
  );
}

export async function createAgentOnCognito(name, email, brokerId) {
  return createUser({ name, userType: CONSTANTS.USER_TYPES.AGENT, email, brokerId });
}

export async function createBrokerOnCognito(name, email) {
  return createUser({ name, userType: CONSTANTS.USER_TYPES.BROKER, email});
}

export async function createAdminOnCognito(name, email) {
  return createUser({ name, userType: CONSTANTS.USER_TYPES.ADMIN, email});
}

export async function reinviteAgent(email) {
    const payload = {
      body: {
        email: email,
        action: CONSTANTS.ACTIONS.REINVITE,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in reinviteUser:',
        'Error in reinviteUser:'
    );
}

export async function forgotPassword(email) {
    const payload = {
      body: {
        email: email,
        action: CONSTANTS.ACTIONS.FORGOT_PASSWORD,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in forgotPassword:',
        'Error in forgotPassword:'
    );
}

export async function getBrokerAgentsDetails(brokerId, withSearchCount = false) {
    const payload = {
      body: {
        brokerId: brokerId,
        withSearchCount: withSearchCount,
        action: CONSTANTS.ACTIONS.GET_BROKER_AGENTS_DETAILS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getBrokerAgentsDetails:',
        'Error in getBrokerAgentsDetails:'
    );
}

export async function getBrokerDetails(brokerId) {
    const payload = {
      body: {
        brokerId: brokerId,
        action: CONSTANTS.ACTIONS.GET_BROKER_DETAILS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getBrokerDetails:',
        'Error in getBrokerDetails:'
    );
}

export async function getAgentDetails(agentId) {
    const payload = {
      body: {
        agentId: agentId,
        action: CONSTANTS.ACTIONS.GET_AGENT_DETAILS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getAgentDetails:',
        'Error in getAgentDetails:'
    );
}

export async function getAdminDetails(adminId) {
    const payload = {
      body: {
        adminId: adminId,
        action: CONSTANTS.ACTIONS.GET_ADMIN_DETAILS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getAdminDetails:',
        'Error in getAdminDetails:'
    );
}

export async function getAgentsTotalSearches(brokerId, fromDatetime, toDatetime) {
    const payload = {
      body: {
        brokerId: brokerId,
        action: CONSTANTS.ACTIONS.GET_AGENTS_TOTAL_SEARCHES_FOR_BROKER,
        fromDatetime: fromDatetime,
        toDatetime: toDatetime,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getAgentsTotalSearches:',
        'Error in getAgentsTotalSearches:'
    );
}

export async function getBrokerTotalSearches(brokerId, fromDatetime, toDatetime) {
    const payload = {
      body: {
        brokerId: brokerId,
        action: CONSTANTS.ACTIONS.GET_BROKER_SEARCHES,
        fromDatetime: fromDatetime,
        toDatetime: toDatetime,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getBrokerTotalSearches:',
        'Error in getBrokerTotalSearches:'
    );
}

export async function getBrokersWithSearchCount(nextToken) {
    const payload = {
      body: {
        nextToken: nextToken,
        action: CONSTANTS.ACTIONS.GET_BROKERS_WITH_SEARCH_COUNT,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getBrokersWithSearchCount:',
        'Error in getBrokersWithSearchCount:'
    );
}

export async function getTotalBrokers() {
    const payload = {
      body: {
        action: CONSTANTS.ACTIONS.GET_TOTAL_BROKERS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getTotalBrokers:',
        'Error in getTotalBrokers:'
    );
}

export async function updateBrokerStatus(brokerId, status) {
    const payload = {
      body: {
        brokerId: brokerId,
        status: status,
        action: CONSTANTS.ACTIONS.UPDATE_BROKER_STATUS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in updateBrokerStatus:',
        'Error in updateBrokerStatus:'
    );
}

export async function updateBroker(brokerId, input) {
    const payload = {
      body: {
        brokerId: brokerId,
        input: input,
        action: CONSTANTS.ACTIONS.UPDATE_BROKER,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in updateBroker:',
        'Error in updateBroker:'
    );
}

export async function updateAgent(agentId, input) {
    const payload = {
      body: {
        agentId: agentId,
        input: input,
        action: CONSTANTS.ACTIONS.UPDATE_AGENT,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in updateAgent:',
        'Error in updateAgent:'
    );
}

export async function updateAdmin(adminId, input) {
    const payload = {
      body: {
        adminId: adminId,
        input: input,
        action: CONSTANTS.ACTIONS.UPDATE_ADMIN,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in updateAdmin:',
        'Error in updateAdmin:'
    );
}

export async function getTotalBrokerSearchesThisMonth() {
    const payload = {
      body: {
        action: CONSTANTS.ACTIONS.GET_TOTAL_BROKER_SEARCHES_THIS_MONTH,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getTotalBrokerSearchesThisMonth:',
        'Error in getTotalBrokerSearchesThisMonth:'
    );
}


export async function getAgentTotalSearchesThisMonth(agentId) {
    const payload = {
      body: {
        agentId: agentId,
        action: CONSTANTS.ACTIONS.GET_AGENT_TOTAL_SEARCHES_THIS_MONTH
      },
    };
    const data = await callUserAdminApi(
        payload,
        'Success in getAgentTotalSearchesThisMonth:',
        'Error in getAgentTotalSearchesThisMonth:'
    );
    return data.totalSearches;
}

export async function getPendingAgentSearches(brokerId, fromDatetime, toDatetime) {
    const payload = {
      body: {
        brokerId: brokerId,
        action: CONSTANTS.ACTIONS.GET_PENDING_AGENT_SEARCHES,
        fromDatetime: fromDatetime,
        toDatetime: toDatetime,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getPendingAgentSearches:',
        'Error in getPendingAgentSearches:'
    );
}

export async function getUnassignedAgents() {
    const payload = {
      body: {
        action: CONSTANTS.ACTIONS.GET_UNASSIGNED_AGENTS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getUnassignedAgents:',
        'Error in getUnassignedAgents:'
    );
}

export async function listAdmins() {
    const payload = {
      body: {
        action: CONSTANTS.ACTIONS.LIST_ADMINS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in listAdmins:',
        'Error in listAdmins:'
    );
}

export async function listBrokers() {
    const payload = {
      body: {
        action: CONSTANTS.ACTIONS.LIST_BROKERS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in listBrokers:',
        'Error in listBrokers:'
    );
}

export async function getTopPerformerAgent(brokerId) {
    const payload = {
      body: {
        brokerId: brokerId,
        action: CONSTANTS.ACTIONS.GET_TOP_PERFORMER_AGENT,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getTopPerformerAgent:',
        'Error in getTopPerformerAgent:'
    );
}

export async function UnassignAgent(agentId) {
    const payload = {
      body: {
        agentId: agentId,
        action: CONSTANTS.ACTIONS.UNASSIGN_AGENT,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in UnassignAgent:',
        'Error in UnassignAgent:'
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
        'Success in assignAgent:',
        'Error in assignAgent:'
    );
}

export async function updateAgentStatus(agentId, status) {
    const payload = {
      body: {
        agentId: agentId,
        status: status,
        action: CONSTANTS.ACTIONS.UPDATE_AGENT_STATUS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in updateAgentStatus:',
        'Error in updateAgentStatus:'
    );
}

export async function getActiveBrokers() {
    const payload = {
      body: {
        action: CONSTANTS.ACTIONS.GET_ACTIVE_BROKERS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getActiveBrokers:',
        'Error in getActiveBrokers:'
    );
}

export async function createSearchHistoryForUser(userId, userType, address, searchId, status, downloadLink) {
    const payload = {
      body: {
        userId: userId,
        userType: userType,
        address: address,
        status: status,
        searchId: searchId,
        downloadLink: downloadLink,
        action: CONSTANTS.ACTIONS.CREATE_SEARCH_HISTORY,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in createSearchHistoryForUser:',
        'Error in createSearchHistoryForUser:'
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
        action: CONSTANTS.ACTIONS.UPDATE_SEARCH_HISTORY,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in updateSearchHistory:',
        'Error in updateSearchHistory:'
    );
}

export async function getSearchStatus(searchId) {
    const payload = {
      body: {
        searchId: searchId,
        action: CONSTANTS.ACTIONS.GET_SEARCH_STATUS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in getSearchStatus:',
        'Error in getSearchStatus:'
    );
}

export async function listSearchHistories({ userType, brokerId, userId, nextToken }) {
    const payload = {
      body: {
        userType,
        brokerId,
        userId,
        nextToken,
        action: CONSTANTS.ACTIONS.LIST_SEARCH_HISTORIES,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in listSearchHistories:',
        'Error in listSearchHistories:'
    );
}

export async function listAuditLogs(isAgent, userIds, nextToken) {
    const payload = {
      body: {
        isAgent: isAgent,
        userIds: userIds,
        nextToken: nextToken,
        action: CONSTANTS.ACTIONS.LIST_AUDIT_LOGS,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in listAuditLogs:',
        'Error in listAuditLogs:'
    );
}

export async function initiateSearch(pin, parnum, address, tax_assessment) {
    const payload = {
      body: {
        pin: pin,
        parnum: parnum,
        address: address,
        tax_assessment: tax_assessment,
        action: CONSTANTS.ACTIONS.INITIATE_SEARCH,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in initiateSearch:',
        'Error in initiateSearch:'
    );
}

export async function titleSearch(address) {
    const payload = {
      body: {
        address: address,
        action: CONSTANTS.ACTIONS.TITLE_SEARCH,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in titleSearch:',
        'Error in titleSearch:'
    );
}

export async function sendEmailMessage(name, email, subject, detail) {
    const payload = {
      body: {
        name: name,
        email: email,
        subject: subject,
        detail: detail,
        action: CONSTANTS.ACTIONS.SEND_EMAIL_MESSAGE,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in sendEmailMessage:',
        'Error in sendEmailMessage:'
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
        'Success in deleteUser:',
        'Error in deleteUser:'
    );
}

export async function undeleteUser(userId, email, userType) {
    const payload = {
      body: {
        userId: userId,
        email: email,
        userType: userType,
        action: CONSTANTS.ACTIONS.UNDELETE_USER,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in undeleteUser:',
        'Error in undeleteUser:'
    );
}

export async function createAuditLog(userId, email, log_action, detail, isAgent) {
    const payload = {
      body: {
        userId: userId,
        email: email,
        log_action: log_action,
        detail: detail,
        isAgent: isAgent,
        action: CONSTANTS.ACTIONS.CREATE_AUDIT_LOG,
      },
    };
    return callUserAdminApi(
        payload,
        'Success in createAuditLog:',
        'Error in createAuditLog:'
    );
}
