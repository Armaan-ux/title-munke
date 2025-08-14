import { API } from 'aws-amplify';

async function createUser(email, password) {
  try {
    const apiName = 'usersAdmin'; // The name you gave in 'amplify add api'
    const path = '/users';
    const payload = {
      body: {
        email: email,
        temporaryPassword: password,
      },
    };
    // The Amplify API library automatically adds the user's JWT
    // to the Authorization header for you.
    const response = await API.post(apiName, path, payload);
    console.log('Successfully created user:', response);
  } catch (error) {
    console.error('Error creating user:', error.response.data);
  }
}

async function reinviteAgent(email) {
  try {
    const apiName = 'usersAdmin'; // The name you gave in 'amplify add api'
    const path = '/users';
    const payload = {
      body: {
        email: email
      },
    };
    // The Amplify API library automatically adds the user's JWT
    // to the Authorization header for you.
    const response = await API.post(apiName, path, payload);
    console.log('Successfully created user:', response);
  } catch (error) {
    console.error('Error creating user:', error.response.data);
  }
}