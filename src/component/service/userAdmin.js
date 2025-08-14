//import { API } from 'aws-amplify'; // Keep this import for now, but it will be removed soon.
//import awsExports from '../../aws-exports';

//const apiName = 'usersAdmin';
//const path = '/users';

async function callUserAdminApi(payload, successMessage, errorMessage) {
//  console.log('awsExports.aws_cloud_logic_custom: ', awsExports.aws_cloud_logic_custom);
//  console.log('path: ', path);
//  console.log('path.substring(1): ', path.substring(1));
  try {
    const apiUrl = 'https://rvz67ef1yc.execute-api.us-east-1.amazonaws.com/master/users';
//    const apiUrl = `${awsExports.aws_cloud_logic_custom[0].endpoint}/${path.substring(1)}`; // Construct the full API URL
    console.log('apiUrl: ', apiUrl);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
//      body: JSON.stringify(payload.body), // Assuming payload.body contains the actual data
    });
    console.log(successMessage, response);
    return response;
  } catch (error) {
    console.error(errorMessage, error);
    throw error; // Re-throw to allow calling functions to handle if needed
  }
}

export async function createAgent(name, email, password, brokerId) {
  const payload = {
    body: {
      name: name,
      userType: 'agent',
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
