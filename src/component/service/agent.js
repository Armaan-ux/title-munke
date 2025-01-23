import { Auth, API, graphqlOperation } from "aws-amplify";
import { createAgent, createRelationship } from "../../graphql/mutations"; // Auto-generated
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
    const createUserResponse = await cognito
      .adminCreateUser({
        UserPoolId: userPoolId,
        Username: name,
        TemporaryPassword: password,
        UserAttributes: [{ Name: "email", Value: email }],
        MessageAction: "SUPPRESS",
      })
      .promise();

    console.log("User created:", createUserResponse);

    const response = await cognito
      .adminAddUserToGroup({
        UserPoolId: userPoolId,
        Username: name,
        GroupName: "agent",
      })
      .promise();

    console.log("User added to Agent group:", response);

    // Step 2: Add Agent Data to DynamoDB
    const agentInput = {
      id: createUserResponse?.User?.Attributes[1].Value,
      name: name,
    };

    const broker = await fetchBroker(brokerId);

    const newAgent = await API.graphql(
      graphqlOperation(createAgent, { input: agentInput })
    );

    const agentId = newAgent.data.createAgent.id;

    console.log("Agent created successfully in DynamoDB:", newAgent);

    // Step 3: Add Relationship Data
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

    return { success: true, message: "Agent created and linked successfully." };
  } catch (error) {
    console.error("Error creating agent for broker:", error);
    return { success: false, error: error.message };
  }
}
