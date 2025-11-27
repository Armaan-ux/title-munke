import React, { createContext, useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";
import {
  getAdminDetails,
  getAgentBrokerDetails,
  getAgentDetails,
  getSubscriptionDetails,
  updateAdmin,
  updateAgent,
  updateBroker,
} from "../components/service/userAdmin";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [invalidateSearchHistory, setInvalidateSearchHistory] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [memberModal, setMemberModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);
  const [paymentFailedModal, setPaymentFailedModal] = useState(false);
  const userType = user?.signInUserSession?.idToken?.payload['cognito:groups']?.[0];
  const [cardListingModal, setCardListingModal] = useState(false);
  console.log("userType", userType, user?.attributes?.sub);
  const agentBrokerDetailQuery = useQuery({
      queryKey: ["agentBrokerDetail", user?.attributes?.sub],
      queryFn: () => getAgentBrokerDetails(user?.attributes?.sub),
      enabled: userType === "agent",
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false
    })
  const brokerId = agentBrokerDetailQuery?.data?.relationship?.brokerId;

  const subsDetailQuery = useQuery({
    queryKey: ["subcription-details", user?.attributes?.sub, userType],
    queryFn: () => getSubscriptionDetails(user?.attributes?.sub, userType),
    enabled: !!user?.attributes?.sub && (userType === "broker" || userType === "individual"),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false
  })

  useEffect(() => {
    if(userType === "agent")
      getAgentDetails(user?.attributes?.sub).then(res => console.log("agent", res))
  }, [user?.attributes?.sub, userType])

  useEffect(() => {
    if(agentBrokerDetailQuery?.isSuccess) {
      getSubscriptionDetails(brokerId, "broker")
      .then(subData => setUser(pre => ({...pre, brokerStatus: subData?.status, brokerId})))
    }
  }, [agentBrokerDetailQuery?.data, agentBrokerDetailQuery?.isSuccess, brokerId])

  useEffect(() => {
    if(subsDetailQuery?.isError) {
      setUser(pre => ({
        ...pre, 
        status: null, 
        // cancel_at: subsDetailQuery?.data?.cancel_at,
        // cancel_at_period_end: subsDetailQuery?.data?.cancel_at_period_end,
        isIndividualCardAdded: false,
      }))
      setMemberModal(true)
    }
  }, [subsDetailQuery?.isError])
  
  useEffect(() => {
    if(subsDetailQuery?.isSuccess) {
      setUser(pre => ({
        ...pre, 
        status: subsDetailQuery?.data?.status, 
        cancel_at: subsDetailQuery?.data?.cancel_at,
        cancel_at_period_end: subsDetailQuery?.data?.cancel_at_period_end,
        isIndividualCardAdded: !!subsDetailQuery?.data?.payment_methods?.length,
      }))
      setMemberModal(subsDetailQuery?.data?.status === "active" ? false : true)
    }
  }, [subsDetailQuery?.data, subsDetailQuery?.isSuccess])

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser({...currentUser, isAddCard: true});
        setIsAuthenticated(true);
     
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

      setUser({...user, isAddCard: true}); // Set the user state
      setIsAuthenticated(true);
      const userGroups =
        user?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
      const userId = user?.attributes?.sub;
      let input = {
        id: user?.attributes?.sub,
        lastLogin: new Date().toISOString(),
      };
      if (userGroups.includes("agent")) {
        updateAgent(userId, input);
      } else if (userGroups.includes("broker")) {
        updateBroker(userId, input);
      } else if (userGroups.includes("admin")) {
        const admin = await getAdminDetails(userId);
        if (admin.status === "UNCONFIRMED") {
          input["status"] = "ACTIVE";
        }
        await updateAdmin(userId, input);
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
    localStorage?.clear()
    navigate("/login");
    // window.location.href = "/login";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signIn,
        signOut,
        isAuthenticated,
        isLoading,
        setMemberModal,
        memberModal,
        setPaymentModal,
        paymentModal,
        setPaymentSuccessModal,
        paymentSuccessModal,
        setPaymentFailedModal,
        paymentFailedModal,
        cardListingModal, 
        setCardListingModal,
        invalidateSearchHistory, 
        setInvalidateSearchHistory
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
