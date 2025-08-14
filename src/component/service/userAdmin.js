import { API } from 'aws-amplify';

const apiName = 'usersAdmin';
const path = '/users';

async function callUserAdminApi(payload, successMessage, errorMessage) {
  try {
    const response = await API.post(apiName, path, payload);
    console.log(successMessage, response);
    return response;
  } catch (error) {
    console.error(errorMessage, error.response.data);
    throw error; // Re-throw to allow calling functions to handle if needed
  }
}

export async function createAgent(name, email, password, brokerId) {
  const payload = {
    body: {
      name: name,
      userType: 'broker',
      email: email,
      temporaryPassword: password,
      brokerId: brokerId,
    },
  }
  return callUserAdminApi(payload, 'Successfully created user:', 'Error creating user:');
}

export async function createBroker(name, email, password) {
  const payload = {
    body: {
      name: name,
      userType: 'broker',
      email: email,
      temporaryPassword: password,
    },
  }
  return callUserAdminApi(payload, 'Successfully created user:', 'Error creating user:');
}

export async function createAdmin(name, email, password) {
  const payload = {
    body: {
      name: name,
      userType: 'admin',
      email: email,
      temporaryPassword: password,
    },
  }
  return callUserAdminApi(payload, 'Successfully created user:', 'Error creating user:');
}

export async function reinviteAgent(email) {
    const payload = {
      body: {
        email: email,
        action: 'reinvite',
      },
    };
    return callUserAdminApi(payload, 'Success in reinviteUser:', 'Error in reinviteUser:');
}
