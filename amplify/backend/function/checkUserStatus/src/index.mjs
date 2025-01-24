import {
  CognitoIdentityProviderClient,
  AdminListGroupsForUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1",
});
const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" });

const AGENT_TABLE_NAME = "Agent-mxixmn4cbbcgrhwtar46djww4q-master";
const BROKER_TABLE_NAME = "Broker-mxixmn4cbbcgrhwtar46djww4q-master";

export const handler = async (event, context) => {
  console.log("Pre-Authentication Event:", JSON.stringify(event, null, 2));

  const userId = event.request.userAttributes.sub; // User ID
  const userPoolId = event.userPoolId;
  const username = event.userName;

  try {
    // Fetch user's groups using AdminListGroupsForUser
    const groupsCommand = new AdminListGroupsForUserCommand({
      UserPoolId: userPoolId,
      Username: username,
    });
    const groupsResponse = await cognitoClient.send(groupsCommand);

    const userGroups = groupsResponse.Groups.map((group) => group.GroupName); // Extract group names

    if (!userGroups || userGroups.length === 0) {
      throw new Error("User does not belong to any group.");
    }

    let tableName;
    if (userGroups.includes("agent")) {
      tableName = AGENT_TABLE_NAME;
    } else if (userGroups.includes("broker")) {
      tableName = BROKER_TABLE_NAME;
    } else {
      throw new Error("User group is not recognized.");
    }

    // Query the appropriate DynamoDB table
    const params = {
      TableName: tableName,
      Key: {
        id: { S: userId },
      },
    };

    const result = await dynamoDBClient.send(new GetItemCommand(params));

    if (!result.Item) {
      throw new Error("User does not exist in the system.");
    }

    const userStatus = result.Item.status.S;
    if (userStatus === "INACTIVE") {
      throw new Error("User is inactive and cannot log in.");
    }

    return event; // Allow login
  } catch (error) {
    console.error("Error in Pre-Authentication Trigger:", error.message);
    throw new Error("Login denied: " + error.message);
  }
};
