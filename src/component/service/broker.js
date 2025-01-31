import { API, Auth, graphqlOperation } from "aws-amplify";
import { createBroker, updateBroker } from "../../graphql/mutations";
import {
  getBroker,
  listBrokers,
  relationshipsByBrokerId,
} from "../../graphql/queries";
import { getAgentTotalSearchesThisMonth } from "./agent";
import AWSExport from "../../aws-exports";
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  region: "us-east-1",
});

const cognito = new AWS.CognitoIdentityServiceProvider();
const userPoolId = AWSExport.aws_user_pools_id;
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
    if (response.data?.relationshipsByBrokerId.items?.length === 0) return [];
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
          lastLogin: agentDetails.lastLogin,
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
    console.log("agentsData", agentsData);
    const updatedAgents = await Promise.all(
      agentsData.map(async (agent) => {
        const searchCount = await getAgentTotalSearchesThisMonth(agent.agentId);
        return { ...agent, totalSearches: searchCount };
      })
    );
    console.log("updatedAgents", updatedAgents);
    return updatedAgents || [];
  } catch (error) {
    console.error("Error fetching agents and their search count:", error);
  }
}

export async function getBrokerTotalSearchesThisMonth(brokerId) {
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
      ":agentId": brokerId,
      ":start": currentMonthStart.toISOString(),
      ":end": nextMonthStart.toISOString(),
    },
  };

  // Fetch the search data
  const searchData = await dynamoDB.scan(searchQuery).promise();

  // Return the total searches
  const totalSearches = searchData.Count || 0;

  console.log(`Total searches for agent ${brokerId}:`, totalSearches);
  return totalSearches;
}

export async function createBrokerLogin(name, email, password) {
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
        GroupName: "broker",
      })
      .promise();

    console.log("User added to Broker group:", response);

    // Step 2: Add Agent Data to DynamoDB
    const brokerInput = {
      id: createUserResponse.userSub,
      name: name,
      email,
      status: "UNCONFIRMED",
      lastLogin: new Date().toISOString(),
    };

    const newBroker = await API.graphql(
      graphqlOperation(createBroker, { input: brokerInput })
    );

    console.log("Broker Created successfully:", newBroker);

    return {
      newBroker: newBroker?.data?.createBroker,
      success: true,
      message: "Broker created and linked successfully.",
    };
  } catch (error) {
    console.error("Error creating agent for broker:", error);
    throw error;
  }
}

export async function fetchTotalBrokerSearchesThisMonth() {
  const brokers = await API.graphql(graphqlOperation(listBrokers, {}));
  let search = 0;
  await Promise.all(
    brokers.data.listBrokers.items.map(async (broker) => {
      const searchCount = await getBrokerTotalSearchesThisMonth(broker.id);
      search = search + searchCount;
    })
  );
  return search;
}
export async function fetchTotalBrokers() {
  const brokers = await API.graphql(graphqlOperation(listBrokers, {}));
  return brokers?.data?.listBrokers?.items;
}

export async function fetchActiveBrokers() {
  const brokers = await API.graphql(
    graphqlOperation(listBrokers, {
      filter: {
        status: { eq: "ACTIVE" },
      },
    })
  );
  return brokers?.data?.listBrokers?.items;
}

export async function fetchTotalActiveBrokers() {
  const brokers = await API.graphql({
    query: listBrokers,
    variables: {
      filter: { status: { eq: "ACTIVE" } },
    },
  });

  return brokers?.data?.listBrokers?.items;
}

export async function fetchBrokersWithSearchCount(token) {
  try {
    const brokers = await API.graphql(
      graphqlOperation(listBrokers, {
        limit: 10,
        nextToken: token,
      })
    );

    const updatedBrokers = await Promise.all(
      brokers.data.listBrokers.items.map(async (broker) => {
        const searchCount = await getBrokerTotalSearchesThisMonth(broker.id);
        return { ...broker, totalSearches: searchCount };
      })
    );
    console.log("updatedBroker", updatedBrokers);
    return { updatedBrokers, nextToken: brokers?.data?.listBrokers?.nextToken };
  } catch (error) {
    console.error("Error fetching agents and their search count:", error);
  }
}

export async function inActiveBroker(brokerId) {
  try {
    await API.graphql(
      graphqlOperation(updateBroker, {
        input: { id: brokerId, status: "INACTIVE" },
      })
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function activeBroker(brokerId) {
  try {
    await API.graphql(
      graphqlOperation(updateBroker, {
        input: { id: brokerId, status: "ACTIVE" },
      })
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
