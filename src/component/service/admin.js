import { API, graphqlOperation } from "aws-amplify";
import { createAdmins } from "../../graphql/mutations";
import { createAdminOnCognito } from "./userAdmin";

export async function createAdminAccount(name, email) {
  try {
    createUserResponse = await createAdminOnCognito(name, email);

    // Step 2: Add admin Data to DynamoDB
    const adminInput = {
      id: createUserResponse.User.Attributes.find(
        (attr) => attr.Name === "sub"
      ).Value,
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
