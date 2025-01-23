import { API, graphqlOperation } from "aws-amplify";
import { getBroker } from "../../graphql/queries";

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
