import { Auth, API, graphqlOperation } from "aws-amplify";
import {
  createAgent,
  createRelationship,
  deleteRelationship,
  updateAgent,
} from "../../graphql/mutations";
import AWSExport from "../../aws-exports";
import { createAgentOnCognito } from "./userAdmin";
import { fetchBroker } from "./broker";
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  region: "us-east-1",
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getAgentsTotalSearchesThisMonth(brokerId) {
  // FIXME: This function requires direct DynamoDB access from the frontend, which is insecure.
  // It needs to be refactored to call a backend API endpoint.
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const nextMonthStart = new Date(currentMonthStart);
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

  const relationshipQuery = {
    TableName: "Relationship-mxixmn4cbbcgrhwtar46djww4q-master",
    IndexName: "brokerIdIndex", // Assuming you have a GSI on brokerId
    KeyConditionExpression: "brokerId = :brokerId",
    ExpressionAttributeValues: {
      ":brokerId": brokerId,
    },
  };

  const relationshipData = await dynamoDB.query(relationshipQuery).promise();
  const agentIds = relationshipData.Items.map((item) => item.agentId);

  if (agentIds.length === 0) {
    return { totalSearches: 0 };
  }

  let totalSearches = 0;

  for (const agentId of agentIds) {
    const searchQuery = {
      TableName: "SearchHistory-mxixmn4cbbcgrhwtar46djww4q-master",
      FilterExpression: "#userId = :agentId AND #ts BETWEEN :start AND :end",
      ExpressionAttributeNames: {
        "#userId": "userId",
        "#ts": "timestamp",
      },
      ExpressionAttributeValues: {
        ":agentId": agentId,
        ":start": currentMonthStart.toISOString(),
        ":end": nextMonthStart.toISOString(),
      },
    };

    const searchData = await dynamoDB.scan(searchQuery).promise();
    totalSearches += searchData.Count;
  }

  console.log("totalSearches", totalSearches);
  console.warn("getAgentsTotalSearchesThisMonth is not implemented securely and will not work.");
  return { totalSearches };
}

export function calculateAverage(totalSearches, agentCount) {
  return totalSearches / agentCount;
}

export async function getAgentTotalSearchesThisMonth(agentId) {
  // FIXME: This function requires direct DynamoDB access from the frontend, which is insecure.
  // It needs to be refactored to call a backend API endpoint.
  // Get the start of the current month
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  // Get the start of the next month
  const nextMonthStart = new Date(currentMonthStart);
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

  // Construct the query for the agent's search history
  const searchQuery = {
    TableName: "SearchHistory-mxixmn4cbbcgrhwtar46djww4q-master",
    FilterExpression: "#userId = :agentId AND #ts BETWEEN :start AND :end",
    ExpressionAttributeNames: {
      "#userId": "userId",
      "#ts": "timestamp",
    },
    ExpressionAttributeValues: {
      ":agentId": agentId,
      ":start": currentMonthStart.toISOString(),
      ":end": nextMonthStart.toISOString(),
    },
  };

  // Fetch the search data
  const searchData = await dynamoDB.scan(searchQuery).promise();

  // Return the total searches
  const totalSearches = searchData.Count || 0;

  console.log(`Total searches for agent ${agentId}:`, totalSearches);
  console.warn("getAgentTotalSearchesThisMonth is not implemented securely and will not work.");
  return totalSearches;
}

export const confirmUser = async (username, code) => {
  try {
    const response = await Auth.confirmSignUp(username, code);
    console.log("User confirmed successfully!", response);
    return response;
  } catch (error) {
    if (error.code === "ExpiredCodeException") {
      console.error("OTP has expired. Please request a new one.");
    } else if (error.code === "CodeMismatchException") {
      console.error("Invalid OTP. Please try again.");
    } else {
      console.error("Error confirming user:", error);
    }
    throw error;
  }
};

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

/**
 * Reinvites an agent by resending the Cognito invitation email.
 * This resets the expiration limit on the user's temporary password.
 * The user must be in an 'UNCONFIRMED' state.
 *
 * @param email - The email of the agent to reinvite.
 * @returns {Promise<object>} - An object indicating success or failure.
 */
// The reinviteAgent function is correctly implemented in userAdmin.js
// and should be used from there. This commented-out block is redundant and has been removed.

export async function UnassignAgent(id, agentId) {
  try {
    await API.graphql(graphqlOperation(deleteRelationship, { input: { id } }));
    await API.graphql(
      graphqlOperation(updateAgent, {
        input: { id: agentId, assigned: false },
      })
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function assignAgent(agentId, name, brokerId) {
  try {
    const broker = await fetchBroker(brokerId);

    const relationshipInput = {
      brokerId: brokerId,
      agentId: agentId,
      agentName: name,
      brokerName: broker.name,
    };

    await API.graphql(
      graphqlOperation(createRelationship, { input: relationshipInput })
    );

    await API.graphql(
      graphqlOperation(updateAgent, {
        input: { id: agentId, assigned: true },
      })
    );
    console.log("Agent Assigned Successfully");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function inActiveAgent(agentId, status) {
  try {
    await API.graphql(
      graphqlOperation(updateAgent, {
        input: { id: agentId, status },
      })
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function pendingAgentSearch(brokerId) {
  // FIXME: This function requires direct DynamoDB access from the frontend, which is insecure.
  // It needs to be refactored to call a backend API endpoint.
  const relationshipQuery = {
    TableName: "Relationship-mxixmn4cbbcgrhwtar46djww4q-master",
    IndexName: "brokerIdIndex", // Assuming you have a GSI on brokerId
    KeyConditionExpression: "brokerId = :brokerId",
    ExpressionAttributeValues: {
      ":brokerId": brokerId,
    },
  };

  const relationshipData = await dynamoDB.query(relationshipQuery).promise();
  const agentIds = relationshipData.Items.map((item) => item.agentId);

  let pendingSearches = 0;

  if (agentIds.length === 0) {
    return { pendingSearches };
  }

  for (const agentId of agentIds) {
    const searchQuery = {
      TableName: "SearchHistory-mxixmn4cbbcgrhwtar46djww4q-master",
      FilterExpression: "#userId = :agentId AND #status = :inProgress",
      ExpressionAttributeNames: {
        "#userId": "userId",
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":agentId": agentId,
        ":inProgress": "In Progress",
      },
    };

    const searchData = await dynamoDB.scan(searchQuery).promise();
    pendingSearches += searchData.Count;
  }
  console.warn("pendingAgentSearch is not implemented securely and will not work.");
  return { pendingSearches };
}

function findTopSearcher(agentData) {
  let topAgent = null;
  let maxCount = 0;

  for (const [agentId, data] of Object.entries(agentData)) {
    if (data.count > maxCount) {
      maxCount = data.count;
      topAgent = { agentId, ...data };
    }
  }

  return topAgent;
}

export const getTopPerformerAgent = async (brokerId) => {
  // FIXME: This function requires direct DynamoDB access from the frontend, which is insecure.
  // It needs to be refactored to call a backend API endpoint.
  const relationshipQuery = {
    TableName: "Relationship-mxixmn4cbbcgrhwtar46djww4q-master",
    IndexName: "brokerIdIndex", // Assuming you have a GSI on brokerId
    KeyConditionExpression: "brokerId = :brokerId",
    ExpressionAttributeValues: {
      ":brokerId": brokerId,
    },
  };

  const relationshipData = await dynamoDB.query(relationshipQuery).promise();

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const nextMonthStart = new Date(currentMonthStart);
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
  const allSearches = {};
  for (const agent of relationshipData.Items) {
    const searchQuery = {
      TableName: "SearchHistory-mxixmn4cbbcgrhwtar46djww4q-master",
      FilterExpression: "#userId = :agentId AND #ts BETWEEN :start AND :end",
      ExpressionAttributeNames: {
        "#userId": "userId",
        "#ts": "timestamp",
      },
      ExpressionAttributeValues: {
        ":agentId": agent.agentId,
        ":start": currentMonthStart.toISOString(),
        ":end": nextMonthStart.toISOString(),
      },
    };

    const searchData = await dynamoDB.scan(searchQuery).promise();
    allSearches[agent.agentId] = {
      count: searchData.Count,
      agentName: agent.agentName,
    };
  }

  console.log(allSearches);
  const topSearcher = findTopSearcher(allSearches);
  console.warn("getTopPerformerAgent is not implemented securely and will not work.");
  return `${topSearcher?.agentName || "None"} (${topSearcher?.count || 0})`;
};
