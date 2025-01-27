import React, { createContext, useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";

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
      return { user, isResetRequired: false };
    } catch (error) {
      if (error.code === "UserNotConfirmedException") {
        console.error("User is not confirmed. Prompt for OTP verification.");
        return { isResetRequired: true, error: "UserNotConfirmed" };
      }
      return { user: null, isResetRequired: false };
    }
  };

  // Method to sign out
  const signOut = async () => {
    try {
      await Auth.signOut();
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
