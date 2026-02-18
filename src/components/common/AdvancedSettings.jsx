import { ArrowRight, Lock } from "lucide-react";
import React, { useState } from "react";
import { CancelSubscriptionModal } from "../Modal/CancelSubscriptionModal";
import { Button } from "../ui/button";
import { JoinBrokerModal } from "../Modal/JoinBrokerModal";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useUser } from "@/context/usercontext";
import { useQuery } from "@tanstack/react-query";
import { getBrokerAndOrganizationSelectListing, getBrokerDetails } from "../service/userAdmin";

const AdvancedSettings = () => {
  const [cancleSubscriptionModal, setCancleSubscriptionModal] = useState(false);
  const [joinBrokerModal, setJoinBrokerModal] = useState(false);
  const { userType, userId } = useUserIdType();
  const { agentDetail } = useUser();
  const { isUnderBroker = false, relationship = {} } = agentDetail || {};
  const brokerDetailQuery = useQuery({
    queryKey: ["agentBrokerDetail"],
    queryFn: () => getBrokerDetails(userId),
    enabled: userType === "broker",
  });
    const brokerAndOrganizationUserListQuery = useQuery({
      queryKey: ["brokerAndOrganizationSelectListing"],
      queryFn: getBrokerAndOrganizationSelectListing,
      enabled: userType === "agent"
    })
    console.log(
      "brokerAndOrganizationUserListQuery",brokerAndOrganizationUserListQuery?.data
    )
  const { isUnderOrganisation, relationship: relationshipBroker } =
    brokerDetailQuery?.data ||{};
  const { organisationFirstName = "-" } = relationshipBroker ||{};
  const { brokerFirstName = "-" } = relationship || {};
  let buttonLabel = "";

  if (userType === "agent") {
    buttonLabel = isUnderBroker ? "Leave Broker" : "Join Broker";
  }

  if (userType === "broker") {
    buttonLabel = isUnderOrganisation
      ? "Leave Organisation"
      : "Join Organisation";
  }
  return (
    <>
      <CancelSubscriptionModal
        open={cancleSubscriptionModal}
        onClose={() => setCancleSubscriptionModal(false)}
        fromAdvancedSettings={true}
      />
      <JoinBrokerModal
        open={joinBrokerModal}
        onClose={() => setJoinBrokerModal(false)}
        onSendRequest={(message) => {
          console.log(message);
          setJoinBrokerModal(false);
        }}
        brokerName={"Michael Brown"}
        brokerEmail={"V0t4K@example.com"}
        activeAgents={120}
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
            <Button className="flex items-center gap-2 bg-tertiary text-white px-4 py-2 rounded-md hover:bg-red-800 transition">
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
              onClick={() => userType === "agent"  &&  isUnderBroker ?   setCancleSubscriptionModal(true): setJoinBrokerModal(true)}
              className="flex items-center gap-2 bg-tertiary text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
            >
              {buttonLabel}
              <ArrowRight size={16} />
            </Button>
          </div>
          {/* Pay as You Do Card */}
          <div className="bg-[#F5F0EC] rounded-xl p-6 md:p-8 w-full shadow-sm my-5">
            <p className="text-lg font-medium mb-2">Pay as You Do</p>
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
