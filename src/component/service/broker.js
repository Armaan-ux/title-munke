import { API, graphqlOperation } from "aws-amplify";
import { getBroker, relationshipsByBrokerId } from "../../graphql/queries";
import { getAgentTotalSearchesThisMonth } from "./agent";
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  region: "us-east-1",
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
export async function fetchBroker(brokerId) {
  try {
    const response = await API.graphql(
      graphqlOperation(getBroker, { id: brokerId })
    );
    console.log("Broker data:", response.data.getBroker);
    return response.data.getBroker;
  } catch (error) {
    console.error("Error fetching broker data:", error);
    throw error;
  }
}

export async function fetchAgentsOfBroker(brokerId) {
  try {
    const response = await API.graphql(
      graphqlOperation(relationshipsByBrokerId, { brokerId: brokerId })
    );

    const agentDetailsQuery = {
      RequestItems: {
        "Agent-mxixmn4cbbcgrhwtar46djww4q-master": {
          Keys: response.data?.relationshipsByBrokerId.items.map((elem) => ({
            id: elem.agentId,
          })),
        },
      },
    };

    // Using batchGet to retrieve details of multiple agents at once
    const agentDetailsData = await dynamoDB
      .batchGet(agentDetailsQuery)
      .promise();

    const combinedAgentsData = response.data?.relationshipsByBrokerId.items.map(
      (relationship) => {
        const agentId = relationship.agentId;

        // Find the corresponding agent details
        const agentDetails = agentDetailsData.Responses[
          "Agent-mxixmn4cbbcgrhwtar46djww4q-master"
        ]?.find((agent) => agent.id === agentId);

        return {
          ...relationship,
          status: agentDetails?.status,
        };
      }
    );

    return combinedAgentsData;
  } catch (error) {
    console.error("Error fetching broker data:", error);
    throw error;
  }
}

export async function fetchAgentsWithSearchCount(brokerId) {
  try {
    const agentsData = await fetchAgentsOfBroker(brokerId);

    const updatedAgents = await Promise.all(
      agentsData.map(async (agent) => {
        const searchCount = await getAgentTotalSearchesThisMonth(agent.agentId);
        return { ...agent, totalSearches: searchCount };
      })
    );
    console.log("updatedAgents", updatedAgents);
    return updatedAgents;
  } catch (error) {
    console.error("Error fetching agents and their search count:", error);
  }
}
