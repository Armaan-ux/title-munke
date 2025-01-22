import { API, Auth } from "aws-amplify";
import { createAuditLog } from "./graphql/mutations";

export const handleCreateAuditLog = async (action, detail) => {
  const user = await Auth.currentAuthenticatedUser();
  const input = {
    userId: user?.attributes?.sub,
    action,
    detail: JSON.stringify(detail),
  };

  try {
    const result = await API.graphql({
      query: createAuditLog,
      variables: { input },
    });
    console.log("Audit Log Created:", result.data.createAuditLog);
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};
