import { ArrowRight, Loader, Lock } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { CancelSubscriptionModal } from "../Modal/CancelSubscriptionModal";
import { Button } from "../ui/button";
import { JoinBrokerModal } from "../Modal/JoinBrokerModal";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useUser } from "@/context/usercontext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRequestToJoinUser,
  cancelRequestToJoinUser,
  changePlanOfUser,
  getBrokerAndOrganizationSelectListing,
  getBrokerDetails,
} from "../service/userAdmin";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { ChangePlanModal } from "../Modal/ChangePlanModal";

const AdvancedSettings = () => {
  const queryClient = useQueryClient();
  const { user, agentDetail, setPaymentModal, setUser, setNewPlanType ,brokerDetail,organisationDetail } =
    useUser();
  const [searchParams] = useSearchParams();
  const isCardAdded = searchParams.get("isCardAdded");
  const [cancelSubscriptionModal, setCancelSubscriptionModal] = useState(false);
  const [changePlanModal, setChangePlanModal] = useState(false);
  const [joinBrokerModal, setJoinBrokerModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [changingPlan, setChangingPlan] = useState("");
  const { userType, userId } = useUserIdType();
  const { isUnderBroker = false, relationship = {} } = agentDetail || {};
  const isPaymentSuccessful = searchParams.get("isPaymentSuccessful");

  /* -------------------- Query Key Mapping -------------------- */
  const queryKeyByUserType = useMemo(
    () => ({
      agent: ["agentDetail"],
      broker: ["brokerDetail"],
      organisation: ["organisationDetail"],
    }),
    [],
  );
  /* -------------------- Queries -------------------- */
  // const brokerDetailQuery = useQuery({
  //   queryKey: ["brokerDetail", userId],
  //   queryFn: () => getBrokerDetails(userId),
  //   enabled: userType === "broker" && !!userId,
  //   staleTime: 5 * 60 * 1000,
  // });

  const brokerOrgListQuery = useQuery({
    queryKey: ["brokerOrgList"],
    queryFn: getBrokerAndOrganizationSelectListing,
    enabled: userId && (userType === "agent" || userType === "broker"),
  });
  /* -------------------- Derived Data -------------------- */
  const brokerAndOrganizationList = brokerOrgListQuery?.data?.data ?? [];

  const dropdownOptions = useMemo(
    () =>
      brokerAndOrganizationList.map((item) => ({
        label: item.name,
        value: item.id,
        type: item.type,
      })),
    [brokerAndOrganizationList],
  );
  const { isUnderOrganisation, relationship: brokerRel } =
    brokerDetail ?? {};
  // const brokerDetail = brokerDetailQuery?.data ?? {};
  const organisationFirstName = brokerRel?.organisationFirstName ?? "-";
  const brokerFirstName = relationship?.brokerFirstName ?? "-";

  const buttonLabel = useMemo(() => {
    if (userType === "agent") {
      return isUnderBroker ? "Leave Broker" : "Join Broker";
    }
    if (userType === "broker") {
      return isUnderOrganisation ? "Leave Organisation" : "Join Organisation";
    }
    return "";
  }, [userType, isUnderBroker, isUnderOrganisation]);

  /* -------------------- Mutations -------------------- */
  const joinRequestMutation = useMutation({
    mutationFn: addRequestToJoinUser,

    onSuccess: () => {
      setJoinBrokerModal(false);

      // refresh data
      queryClient.invalidateQueries(["brokerDetail"]);
      queryClient.invalidateQueries(["brokerOrgList"]);

      toast.success("Request sent successfully");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: cancelRequestToJoinUser,

    onSuccess: () => {
      setJoinBrokerModal(false);

      // refresh data
      queryClient.invalidateQueries(["brokerDetail"]);
      queryClient.invalidateQueries(["brokerOrgList"]);

      toast.success("Request sent successfully");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    },
  });

  const changePlanMutation = useMutation({
    mutationFn: changePlanOfUser,

    onSuccess: (data, variables) => {
      setChangingPlan(null);
      if (data?.clientSecret) {
        if (variables?.newPlanType === "PAY_AS_YOU_GO") {
          setNewPlanType("PAY_AS_YOU_GO");
          // setCardListingModal(true);
        }
        if (variables?.newPlanType === "PROFESSIONAL_PLAN") {
          setNewPlanType("PROFESSIONAL_PLAN");
        }
        setPaymentModal(true);
        setUser((pre) => ({ ...pre, isAddCard: false }));
      } else {
        toast.success("Plan changed successfully");
      }
      // Invalidate query based on userType
      queryClient.invalidateQueries(queryKeyByUserType[userType]);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    },
  });

  /* -------------------- Handlers -------------------- */
  const selectedBroker =
    brokerAndOrganizationList.find((b) => b.id === selectedId) ||
    brokerAndOrganizationList[0] ||
    null;

  const handleDropdownChange = useCallback((value) => {
    setSelectedId(value);
  }, []);

  const sendRequestHandler = useCallback(
    (message) => {
      if (!selectedBroker?.id) {
        toast.error("Please select a broker first");
        return;
      }

      if (joinRequestMutation.isPending) return;

      joinRequestMutation.mutate({
        userType: selectedBroker.__typename?.toLowerCase(),
        userId: selectedBroker.id,
        ...(message && { message }),
      });
    },
    [selectedBroker, joinRequestMutation],
  );
  const changePlanHandler = useCallback(() => {
    if (!changingPlan) {
      toast.error("Please select a plan first");
      return;
    }

    if (changePlanMutation.isPending) return;

    changePlanMutation.mutate({
      newPlanType: changingPlan,
    });
  }, [changePlanMutation, changingPlan]);

  const changePlanModalHandler = useCallback((newPlan) => {
    setChangePlanModal(true);
    setChangingPlan(newPlan);
  }, []);

  const handleConnectionClick = useCallback(() => {
    if (userType === "agent" && isUnderBroker) {
      setCancelSubscriptionModal(true);
    } else {
      setJoinBrokerModal(true);
    }
  }, [userType, isUnderBroker]);
  const cancelPlanHandler = useCallback(() => {
    if (cancelRequestMutation.isPending) return;
    if (userType === "agent" && isUnderBroker) {
      cancelRequestMutation.mutate({
        userType: "broker",
        userId: relationship?.brokerId,
      });
    }
    if (userType === "broker" && isUnderOrganisation) {
      cancelRequestMutation.mutate({
        userType:"organisation",
        userId: brokerRel?.organisationId,
      });

      setCancelSubscriptionModal(false);
    }
  }, [
    cancelRequestMutation,
    userType,
    isUnderBroker,
    isUnderOrganisation,
    relationship?.brokerId,
    brokerRel?.organisationId,
  ]);
  const isPayAsYouGoSelected =
    (userType === "agent" && agentDetail?.planType === "PAY_AS_YOU_GO") ||
    (userType === "broker" && brokerDetail?.planType === "PAY_AS_YOU_GO") || 
    (userType === "organisation" && organisationDetail?.planType === "PAY_AS_YOU_GO")  
  const isProfessionalSelected =
    (userType === "agent" && agentDetail?.planType === "PROFESSIONAL_PLAN") ||
    (userType === "broker" && brokerDetail?.planType === "PROFESSIONAL_PLAN") ||
    (userType === "organisation" && organisationDetail?.planType === "PROFESSIONAL_PLAN")
  return (
    <>
      <CancelSubscriptionModal
        open={cancelSubscriptionModal}
        onClose={() => setCancelSubscriptionModal(false)}
        onCancelSubscription={cancelPlanHandler}
        fromAdvancedSettings
        brokerName={brokerFirstName}
      />
      <ChangePlanModal
        open={changePlanModal}
        onClose={() => setChangePlanModal(false)}
        onChangeSubscription={changePlanHandler}
      />
      <JoinBrokerModal
        dropdownOptions={dropdownOptions}
        open={joinBrokerModal}
        onClose={() => setJoinBrokerModal(false)}
        onSendRequest={sendRequestHandler}
        onDropdownChange={handleDropdownChange}
        brokerName={selectedBroker?.name || ""}
        brokerEmail={selectedBroker?.email || "N/A"}
        activeAgents={selectedBroker?.activeAgents || 0}
        selectedId={selectedId || dropdownOptions[0]?.value || ""}
        isPending={joinRequestMutation?.isPending}
      />
      <div className="bg-white rounded-xl p-8 flex flex-col md:flex-row items-start gap-10 w-full shadow-md ">
        <div className="w-full">
          <p className="text-lg font-semibold border-b border-gray-200 pb-4">
            Advanced Settings
          </p>
          {/* Explore Platform Card */}
          <div className="bg-[#F5F0EC] rounded-xl p-6 md:p-8 w-full shadow-sm my-5">
            <p className="text-lg font-medium mb-2">Explore Platform</p>
            <p className="text-gray-500 mb-4">
              Explore searches and platform features available to you
            </p>
            <Button
              className="flex items-center gap-2 bg-tertiary text-white px-4 py-2 rounded-md hover:bg-red-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled
            >
              <Lock size={16} /> Explore Platform
            </Button>
          </div>
          {/* Broker Connection Card */}
          { userType !== "organisation" && <div className="bg-[#F5F0EC] order border-blue-300 rounded-xl p-6 md:p-8 w-full shadow-sm">
            <p className="text-lg font-medium mb-2"> { userType === "agent" ?"Broker Connection": "Organisation Connection" }</p>

            {userType === "agent" &&
              (isUnderBroker ? (
                <p className="text-gray-500 mb-1">
                  Connected to:{" "}
                  <span className="font-semibold">{brokerFirstName}</span>
                </p>
              ) : (
                <p className="text-gray-500 mb-1">Select Broker to Join</p>
              ))}

            {userType === "broker" &&
              (isUnderOrganisation ? (
                <p className="text-gray-500 mb-1">
                  Connected to:{" "}
                  <span className="font-semibold">{organisationFirstName}</span>
                </p>
              ) : (
                <p className="text-gray-500 mb-1">
                  Select Organisation to Join
                </p>
              ))}

            <p className="text-secondary mb-4">
              Role :{" "}
              <span className="font-semibold">
                {userType === "agent" ? `Agent` : `Broker`}
              </span>
            </p>
            <Button
              onClick={handleConnectionClick}
              className="flex items-center gap-2 bg-tertiary text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
            >
              {buttonLabel}
              <ArrowRight size={16} />
            </Button>
          </div>}
          {/* Pay as You Do Card */}
          <div
            className={`rounded-xl p-6 md:p-8 w-full shadow-sm my-5 transition-all duration-200
    ${
      isPayAsYouGoSelected
        ? "border-2 border-tertiary shadow-lg -translate-y-1 bg-white"
        : "border border-transparent bg-[#F5F0EC]"
    }`}
          >
            <p className="text-lg font-medium mb-2">Pay as You Go</p>
            <p className="text-gray-500 mb-4">
              Pay only for the searches you run — no subscription required.
            </p>
            <Button
              disabled={
                isPayAsYouGoSelected || changingPlan === "PAY_AS_YOU_GO"
              }
              onClick={() => changePlanModalHandler("PAY_AS_YOU_GO")}
              className="flex items-center gap-2 bg-tertiary text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
            >
              Get Started{" "}
              {changingPlan === "PAY_AS_YOU_GO" ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <ArrowRight size={16} />
              )}
            </Button>
          </div>
          {/* Subscription plan change  */}
          <div
            className={`rounded-xl p-6 md:p-8 w-full shadow-sm my-5 transition-all duration-200
    ${
      isProfessionalSelected
        ? "border-2 border-tertiary shadow-lg -translate-y-1 bg-white"
        : "border border-transparent bg-[#F5F0EC]"
    }`}
          >
            <p className="text-lg font-medium mb-2">Subscription Plan</p>
            <p className="text-gray-500 mb-4">
              Pay a monthly fee for unlimited searches and premium features.
            </p>
            <Button
              disabled={
                isProfessionalSelected || changingPlan === "PROFESSIONAL_PLAN"
              }
              onClick={() => changePlanModalHandler("PROFESSIONAL_PLAN")}
              className="flex items-center gap-2 bg-tertiary text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
            >
              Get Started
              {changingPlan === "PROFESSIONAL_PLAN" ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <ArrowRight size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedSettings;
