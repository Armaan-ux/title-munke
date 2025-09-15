import { createAgentOnCognito } from "./userAdmin";

export function calculateAverage(totalSearches, agentCount) {
  return totalSearches / agentCount;
}

export async function createAgentForBroker(brokerId, name, email) {
  try {
    // The backend Lambda handles creating the user in Cognito, the agent in DynamoDB,
    // and the relationship record. This is the secure, modern approach.
    const response = await createAgentOnCognito(name, email, brokerId);
    console.log("Agent creation initiated via backend:", response);

    // The backend response already indicates success.
    return {
      ...response, // Assuming backend returns { success, message }
      success: true,
      message: "Agent created and linked successfully.",
    };
  } catch (error) {
    console.error("Error creating agent for broker:", error);
    // The error is already thrown by callUserAdminApi, so we can just re-throw.
    throw error;
  }
}
