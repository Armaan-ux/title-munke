import { API } from 'aws-amplify';

const apiName = 'usersAdmin';
const endpoint = "https://rvz67ef1yc.execute-api.us-east-1.amazonaws.com/master";
const path = '/users';
const region = 'us-east-1';

Amplify.configure({
    API: {
        endpoints: [
            {
                name: apiName,
                endpoint: endpoint,
                region: region,
                custom_header: async () => {
                    return {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    };
                }
            }
        ]
    }
});

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
  const payload = {
    body: userData,
  };
  return callUserAdminApi(
    payload,
    'Successfully created user:',
    'Error creating user:'
  );
}

export async function createAgent(name, email, password, brokerId) {
  return createUser({ name, userType: 'agent', email, temporaryPassword: password, brokerId });
}

export async function createBroker(name, email, password) {
  return createUser({ name, userType: 'broker', email, temporaryPassword: password });
}

export async function createAdmin(name, email, password) {
  return createUser({ name, userType: 'admin', email, temporaryPassword: password });
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
