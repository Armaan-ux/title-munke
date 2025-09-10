import {
    createBrokerOnCognito,
    getBrokerAgentsDetails,
    getBrokerTotalSearches,
    getActiveBrokers,
    getAgentTotalSearchesThisMonth,
} from "./userAdmin";

export async function fetchAgentsWithSearchCount(brokerId) {
  try {
    const agentsData = await getBrokerAgentsDetails(brokerId, true);
    console.log("agentsData", agentsData);
//    const updatedAgents = await Promise.all(
//      agentsData.map(async (agent) => {
//        const searchCount = await getAgentTotalSearchesThisMonth(agent.agentId);
//        return { ...agent, totalSearches: searchCount };
//      })
//    );
//    console.log("fetchAgentsWithSearchCount: updatedAgents", updatedAgents);
//    return updatedAgents || [];
    return agentsData || [];
  } catch (error) {
    console.error("fetchAgentsWithSearchCount: Error fetching agents and their search count:", error);
  }
}

export async function createBrokerLogin(name, email) {
  try {
    const response = await createBrokerOnCognito(name, email);
    console.log("Broker creation initiated via backend:", response);
    return response;
  } catch (error) {
    console.error("Error creating broker:", error);
    throw error;
  }
}
