import { ArrowRight, Lock } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { CancelSubscriptionModal } from "../Modal/CancelSubscriptionModal";
import { Button } from "../ui/button";
import { JoinBrokerModal } from "../Modal/JoinBrokerModal";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useUser } from "@/context/usercontext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRequestToJoinUser,
  getBrokerAndOrganizationSelectListing,
  getBrokerDetails,
} from "../service/userAdmin";
import { toast } from "react-toastify";

const AdvancedSettings = () => {
  const queryClient = useQueryClient();

  const [cancelSubscriptionModal, setCancelSubscriptionModal] = useState(false);
  const [joinBrokerModal, setJoinBrokerModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const { userType, userId } = useUserIdType();
  const { agentDetail } = useUser();
  const { isUnderBroker = false, relationship = {} } = agentDetail || {};

  /* -------------------- Queries -------------------- */
  const brokerDetailQuery = useQuery({
    queryKey: ["brokerDetail", userId],
    queryFn: () => getBrokerDetails(userId),
    enabled: userType === "broker" && !!userId,
    staleTime: 5 * 60 * 1000,
  });

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
    brokerDetailQuery?.data ?? {};

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
      console.log("message", message);
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

  const handleConnectionClick = useCallback(() => {
    if (userType === "agent" && isUnderBroker) {
      setCancelSubscriptionModal(true);
    } else {
      setJoinBrokerModal(true);
    }
  }, [userType, isUnderBroker]);

  return (
    <>
      <CancelSubscriptionModal
        open={cancelSubscriptionModal}
        onClose={() => setCancelSubscriptionModal(false)}
        fromAdvancedSettings
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
            <Button className="flex items-center gap-2 bg-tertiary text-white px-4 py-2 rounded-md hover:bg-red-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed" disabled>
              <Lock size={16} /> Explore Platform
            </Button>
          </div>
          {/* Broker Connection Card */}
          <div className="bg-[#F5F0EC] order border-blue-300 rounded-xl p-6 md:p-8 w-full shadow-sm">
            <p className="text-lg font-medium mb-2">Broker Connection</p>

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
          </div>
          {/* Pay as You Do Card */}
          <div className="bg-[#F5F0EC] rounded-xl p-6 md:p-8 w-full shadow-sm my-5">
            <p className="text-lg font-medium mb-2">Pay as You Go</p>
            <p className="text-gray-500 mb-4">
              Pay only for the searches you run — no subscription required.
            </p>
            <Button
              onClick={() => setJoinBrokerModal(true)}
              className="flex items-center gap-2 bg-tertiary text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
            >
              Get Started <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedSettings;
