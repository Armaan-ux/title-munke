import { API, Auth, graphqlOperation } from "aws-amplify";
import { createAdmins } from "../../graphql/mutations";
import AWSExport from "../../aws-exports";
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  region: "us-east-1",
});

const cognito = new AWS.CognitoIdentityServiceProvider();
const userPoolId = AWSExport.aws_user_pools_id;
export async function createAdminAccount(name, email, password) {
  try {
    const createUserResponse = await Auth.signUp({
      username: email,
      password: password,
      attributes: {
        email,
      },
    });

    const response = await cognito
      .adminAddUserToGroup({
        UserPoolId: userPoolId,
        Username: email,
        GroupName: "admin",
      })
      .promise();

    console.log("User added to Admin group:", response);

    const adminInput = {
      id: createUserResponse.userSub,
      name: name,
      email,
      status: "UNCONFIRMED",
      lastLogin: new Date().toISOString(),
    };

    const newAdmin = await API.graphql(
      graphqlOperation(createAdmins, { input: adminInput })
    );

    console.log("Admin Created successfully:", newAdmin);

    return {
      newAdmin: newAdmin?.data?.createAdmins,
      success: true,
      message: "Admin created and linked successfully.",
    };
  } catch (error) {
    console.error("Error creating Admin:", error);
    throw error;
  }
}
