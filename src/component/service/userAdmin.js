import { API } from 'aws-amplify';

const apiName = 'usersAdmin';
const path = '/users';

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
  return createUser({ name, userType: 'agent', email, brokerId });
}

export async function createBrokerOnCognito(name, email) {
  return createUser({ name, userType: 'broker', email});
}

export async function createAdminOnCognito(name, email) {
  return createUser({ name, userType: 'admin', email});
}

export async function reinviteAgent(email) {
    const payload = {
      body: {
        email: email,
        action: 'reinvite',
      },
    };
    return callUserAdminApi(
        payload,
        'Success in reinviteUser:',
        'Error in reinviteUser:'
    );
}
