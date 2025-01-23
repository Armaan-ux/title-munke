const AWS = require("aws-sdk");

console.log(process.env.REACT_APP_ACCESS_KEY);
AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  region: "us-east-1",
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const brokerId = "14e814a8-10f1-7045-1386-78fcbb24a0ed"; // Replace with actual broker ID

export async function getTotalSearchesThisMonth() {
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1); // First day of the month
  currentMonthStart.setHours(0, 0, 0, 0);

  const nextMonthStart = new Date(currentMonthStart);
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

  // Step 1: Get all agentIds for the broker
  const relationshipQuery = {
    TableName: "Relationship-mxixmn4cbbcgrhwtar46djww4q-master",
    // IndexName: "brokerId-index", // Assuming you have a GSI on brokerId
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

  // Step 2: Get total searches for all agents in the current month
  const searchQuery = {
    TableName: "SearchHistory",
    FilterExpression:
      "userId IN (:agentIds) AND timestamp BETWEEN :start AND :end",
    ExpressionAttributeValues: {
      ":agentIds": agentIds,
      ":start": currentMonthStart.toISOString(),
      ":end": nextMonthStart.toISOString(),
    },
  };

  const searchData = await dynamoDB.scan(searchQuery).promise();
  return { totalSearches: searchData.Count };
}
