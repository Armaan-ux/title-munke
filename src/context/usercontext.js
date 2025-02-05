import React, { createContext, useState, useEffect, useContext } from "react";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { getAdmins, getAgent, getBroker } from "../graphql/queries";
import { updateAdmins, updateAgent, updateBroker } from "../graphql/mutations";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        console.log("user", currentUser);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    checkUserSession();
  }, []);

  const signIn = async (username, password) => {
    try {
      const user = await Auth.signIn(username, password);
      if (user?.challengeName === "NEW_PASSWORD_REQUIRED") {
        return { user, isResetRequired: true };
      }

      setUser(user);
      setIsAuthenticated(true);
      const userGroups =
        user?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
      if (userGroups.includes("agent")) {
        await API.graphql(
          graphqlOperation(updateAgent, {
            input: {
              id: user?.attributes?.sub,
              lastLogin: new Date().toISOString(),
            },
          })
        );
        const agent = await API.graphql(
          graphqlOperation(getAgent, { id: user?.attributes?.sub })
        );
        if (agent.data.getAgent.status === "UNCONFIRMED") {
          await API.graphql(
            graphqlOperation(updateAgent, {
              input: {
                id: user?.attributes?.sub,
                status: "ACTIVE",
              },
            })
          );
        }
      }
      if (userGroups.includes("broker")) {
        await API.graphql(
          graphqlOperation(updateBroker, {
            input: {
              id: user?.attributes?.sub,
              lastLogin: new Date().toISOString(),
            },
          })
        );
        const broker = await API.graphql(
          graphqlOperation(getBroker, { id: user?.attributes?.sub })
        );
        if (broker.data.getBroker.status === "UNCONFIRMED") {
          await API.graphql(
            graphqlOperation(updateBroker, {
              input: {
                id: user?.attributes?.sub,
                status: "ACTIVE",
              },
            })
          );
        }
      }
      if (userGroups.includes("admin")) {
        await API.graphql(
          graphqlOperation(updateAdmins, {
            input: {
              id: user?.attributes?.sub,
              lastLogin: new Date().toISOString(),
            },
          })
        );
        const admin = await API.graphql(
          graphqlOperation(getAdmins, { id: user?.attributes?.sub })
        );
        if (admin.data.getAdmins.status === "UNCONFIRMED") {
          await API.graphql(
            graphqlOperation(updateAdmins, {
              input: {
                id: user?.attributes?.sub,
                status: "ACTIVE",
              },
            })
          );
        }
      }

      return { user, isResetRequired: false };
    } catch (error) {
      console.error("Error", error.code);
      if (error.code === "UserNotConfirmedException") {
        console.error("User is not confirmed. Prompt for OTP verification.");
        return { isResetRequired: true, error: "UserNotConfirmed" };
      }
      throw error;
    }
  };

  // Method to sign out
  const signOut = async () => {
    try {
      Auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};
