import { Auth, API, graphqlOperation } from "aws-amplify";
import { createAgent, createRelationship } from "../../graphql/mutations"; // Auto-generated
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  region: "us-east-1",
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const brokerId = "14e814a8-10f1-7045-1386-78fcbb24a0ed";

export async function getAgentTotalSearchesThisMonth() {
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
        ":start": "2024-12-31T19:00:00.000Z",
        ":end": "2025-01-31T19:00:00.000Z",
      },
    };

    const searchData = await dynamoDB.scan(searchQuery).promise();
    totalSearches += searchData.Count;
  }

  console.log("totalSearches", totalSearches);
  return { totalSearches };
}

export async function createAgentForBroker(brokerId, name, email, password) {
  try {
    // Step 1: Create a Cognito User
    await Auth.signUp({
      username: name,
      password: password,
      attributes: {
        email: email,
        "custom:name": name, // Add custom attribute 'name'
      },
    });

    console.log("Cognito user created successfully!");

    // Step 2: Add Agent Data to DynamoDB
    const agentInput = {
      name: name,
      email: email,
      brokerId: brokerId,
    };

    const newAgent = await API.graphql(
      graphqlOperation(createAgent, { input: agentInput })
    );
    const agentId = newAgent.data.createAgent.id;

    console.log("Agent created successfully in DynamoDB:", newAgent);

    // Step 3: Add Relationship Data
    const relationshipInput = {
      brokerId: brokerId,
      agentId: agentId,
    };

    const newRelationship = await API.graphql(
      graphqlOperation(createRelationship, { input: relationshipInput })
    );

    console.log("Relationship added successfully:", newRelationship);

    return { success: true, message: "Agent created and linked successfully." };
  } catch (error) {
    console.error("Error creating agent for broker:", error);
    return { success: false, error: error.message };
  }
}
