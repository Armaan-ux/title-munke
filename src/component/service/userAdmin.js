import { API } from 'aws-amplify';

const apiName = 'usersAdmin';
const path = '/users';

const CONSTANTS = {
  ACTIONS: {
    REINVITE: "reinvite",
    GET_AGENT_SEARCHES: "getAgentSearches",
    GET_BROKER_SEARCHES: "getBrokerSearches",
  },
  USER_TYPES: {
    AGENT: "agent",
    BROKER: "broker",
    ADMIN: "admin",
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

export async function getAgentsTotalSearches(brokerId, fromDatetime, toDatetime) {
    const payload = {
      body: {
        brokerId: brokerId,
        action: CONSTANTS.ACTIONS.GET_AGENT_SEARCHES,
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
