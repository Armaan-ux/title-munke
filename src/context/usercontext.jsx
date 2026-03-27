import React, { createContext, useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";
import {
  getAdminDetails,
  getAgentBrokerDetails,
  getAgentDetails,
  getBrokerDetails,
  getOrganisationDetails,
  getSubscriptionDetails,
  updateAdmin,
  updateAdminStatus,
  updateAgent,
  updateBroker,
  updateBrokerStatus,
} from "../components/service/userAdmin";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { handleCreateAuditLog } from "@/utils";
import { setLogoutHandler } from "../utils/logoutManager";

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
  const userType =
    user?.signInUserSession?.idToken?.payload["cognito:groups"]?.[0];
  const [cardListingModal, setCardListingModal] = useState(false);
  const [agentDetail, setAgentDetail] = useState(null);
  const [newPlanType, setNewPlanType] = useState(null);
  const [organisationDetail, setOrganisationDetail] = useState(null);
  const [brokerDetail, setBrokerDetail] = useState(null);
  const agentBrokerDetailQuery = useQuery({
    queryKey: ["agentBrokerDetail", user?.attributes?.sub],
    queryFn: () => getAgentBrokerDetails(user?.attributes?.sub),
    enabled: userType === "agent",
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
  });
  const brokerId = agentBrokerDetailQuery?.data?.relationship?.brokerId;
  const subsDetailQuery = useQuery({
    queryKey: ["subcription-details", user?.attributes?.sub, userType],
    queryFn: () =>
      getSubscriptionDetails(user?.attributes?.sub, userType, "contetx"),
    enabled:
      !!user?.attributes?.sub &&
      (userType === "broker" || userType === "individual"),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
  });

  // useEffect(() => {
  //   if(userType === "agent")
  //    user?.attributes?.sub && getAgentDetails(user?.attributes?.sub).then(res =>{ console.log("agent", res); setAgentDetail(res)})
  // }, [user?.attributes?.sub, userType,newPlanType])
  const agentDetailQuery = useQuery({
    queryKey: ["agentDetail", user?.attributes?.sub, newPlanType],
    queryFn: () => getAgentDetails(user?.attributes?.sub),
    enabled: userType === "agent" && !!user?.attributes?.sub,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });

  const organisaDetailQuery = useQuery({
    queryKey: ["organisationDetail", user?.attributes?.sub, newPlanType],
    queryFn: () => getOrganisationDetails(user?.attributes?.sub),
    enabled: userType === "organisation" && !!user?.attributes?.sub,
    refetchOnWindowFocus: false,
    staleTime: 0,
    retry: false,
  });
  const brokerDetailQuery = useQuery({
    queryKey: ["brokerDetail", user?.attributes?.sub],
    queryFn: () => getBrokerDetails(user?.attributes?.sub),
    enabled: userType === "broker" && !!user?.attributes?.sub,
    staleTime: 1 * 60 * 1000,
  });

  useEffect(() => {
    if (agentDetailQuery.data) {
      setAgentDetail(agentDetailQuery.data);
    }
    if (organisaDetailQuery.data) {
      setOrganisationDetail(organisaDetailQuery.data);
    }
    if (brokerDetailQuery.data) {
      setBrokerDetail(brokerDetailQuery.data);
    }
  }, [agentDetailQuery.data, organisaDetailQuery.data, brokerDetailQuery.data]);

  useEffect(() => {
    if (agentBrokerDetailQuery?.isSuccess && userType === "broker") {
      getSubscriptionDetails(brokerId, "broker").then((subData) =>
        setUser((pre) => ({ ...pre, brokerStatus: subData?.status, brokerId })),
      );
    }
  }, [
    agentBrokerDetailQuery?.data,
    agentBrokerDetailQuery?.isSuccess,
    brokerId,
    userType,
  ]);

  useEffect(() => {
    if (subsDetailQuery?.isError) {
      setUser((pre) => ({
        ...pre,
        status: null,
        // cancel_at: subsDetailQuery?.data?.cancel_at,
        // cancel_at_period_end: subsDetailQuery?.data?.cancel_at_period_end,
        isIndividualCardAdded: false,
      }));
      setMemberModal(true);
    }
  }, [subsDetailQuery?.isError]);

  useEffect(() => {
    if (subsDetailQuery?.isSuccess) {
      setUser((pre) => ({
        ...pre,
        status: subsDetailQuery?.data?.status,
        cancel_at: subsDetailQuery?.data?.cancel_at,
        cancel_at_period_end: subsDetailQuery?.data?.cancel_at_period_end,
        isIndividualCardAdded: !!subsDetailQuery?.data?.payment_methods?.length,
      }));
      setMemberModal(subsDetailQuery?.data?.status === "active" ? false : true);
    }
  }, [subsDetailQuery?.data, subsDetailQuery?.isSuccess]);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser({ ...currentUser, isAddCard: false });
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

      setUser({ ...user, isAddCard: false }); // Set the user state
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
        const status =
          admin.status === "UNCONFIRMED" || admin.status === "UNCONFIRMED"
            ? "ACTIVE"
            : "INACTIVE";

        await updateAdminStatus(userId, status);
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
    await handleCreateAuditLog(
      "logout",
      { detail: `${userType} logged out successfully` },
      userType === "agent",
    );
    await Auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    localStorage?.clear();
    navigate("/subscription-login");
    // window.location.href = "/subscription-login";
  };
  const logOut = async () => {
    await Auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    localStorage?.clear();
    navigate("/subscription-login");
    // window.location.href = "/subscription-login";
  };

  useEffect(() => {
    setLogoutHandler(logOut);
  }, []);
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
        setInvalidateSearchHistory,
        setNewPlanType,
        newPlanType,
        agentDetail,
        brokerDetail,
        organisationDetail,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
