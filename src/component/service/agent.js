import { Auth, API, graphqlOperation } from "aws-amplify";
import {
  createAgent,
  createRelationship,
  deleteRelationship,
  updateAgent,
} from "../../graphql/mutations";
import AWSExport from "../../aws-exports";
import { fetchBroker } from "./broker";
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  region: "us-east-1",
});

const cognito = new AWS.CognitoIdentityServiceProvider();
const userPoolId = AWSExport.aws_user_pools_id;
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getAgentsTotalSearchesThisMonth(brokerId) {
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
  return { totalSearches };
}

export function calculateAverage(totalSearches, agentCount) {
  return totalSearches / agentCount;
}

export async function getAgentTotalSearchesThisMonth(agentId) {
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

export async function createAgentForBroker(brokerId, name, email, password) {
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
        GroupName: "agent",
      })
      .promise();

    console.log("User added to Agent group:", response);

    // Step 2: Add Agent Data to DynamoDB
    const agentInput = {
      id: createUserResponse.userSub,
      name: name,
      email,
      status: "UNCONFIRMED",
      lastLogin: new Date().toISOString(),
      assigned: true,
    };

    const broker = await fetchBroker(brokerId);

    const newAgent = await API.graphql(
      graphqlOperation(createAgent, { input: agentInput })
    );

    const agentId = newAgent.data.createAgent.id;

    console.log("Agent created successfully in DynamoDB:", newAgent);

    const relationshipInput = {
      brokerId: brokerId,
      agentId: agentId,
      agentName: name,
      brokerName: broker.name,
    };

    const newRelationship = await API.graphql(
      graphqlOperation(createRelationship, { input: relationshipInput })
    );

    console.log("Relationship added successfully:", newRelationship);

    return {
      newAgent: newAgent.data.createAgent,
      success: true,
      message: "Agent created and linked successfully.",
    };
  } catch (error) {
    console.error("Error creating agent for broker:", error);
    return { success: false, error: error.message };
  }
}

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
    console.log("Agent Assgined Successfully");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function inActiveAgent(agentId) {
  try {
    await API.graphql(
      graphqlOperation(updateAgent, {
        input: { id: agentId, status: "INACTIVE" },
      })
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function pendingAgentSearch(brokerId) {
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
  return `${topSearcher?.agentName || "None"} (${topSearcher?.count || 0})`;
};
