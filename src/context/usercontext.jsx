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

      setUser(user); // Set the user state
      setIsAuthenticated(true);
      const userGroups =
        user?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
      if (userGroups.includes("agent")) {
        await API.graphql(
          graphqlOperation(updateAgent, {
            input: {
              id: user?.attributes?.sub,
              // Add other fields as needed
            },
          })
        );
      } else if (userGroups.includes("broker")) {
        await API.graphql(
          graphqlOperation(updateBroker, {
            input: {
              id: user?.attributes?.sub,
              // Add other fields as needed
            },
          })
        );
      } else if (userGroups.includes("admin")) {
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
      return { user, isResetRequired: false }; // Return the user object
    } catch (error) {
      console.error("Error", error.code);
      if (error.code === "UserNotConfirmedException") {
        console.error("User is not confirmed. Prompt for OTP verification.");
      }
      throw error; // Re-throw to handle in the Login component
    }
  };

  const signOut = async () => {
    await Auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut, isAuthenticated, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
