import { createAdminOnCognito } from "./userAdmin";

export async function createAdminAccount(name, email) {
  try {
    // The backend Lambda now handles creating the user in Cognito and the admin record in DynamoDB.
    // This frontend function just needs to call the centralized backend action.
    const response = await createAdminOnCognito(name, email);
    console.log("Admin creation initiated via backend:", response);
    // The backend response already indicates success. We can pass it through or augment it.
    return {
      ...response,
      success: true,
      message: "Admin created and linked successfully.",
    };
  } catch (error) {
    console.error("Error creating Admin:", error);
    // The error is already thrown by the underlying callUserAdminApi, so we can just re-throw.
    throw error;
  }
}
