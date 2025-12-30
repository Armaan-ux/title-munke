import { Button } from "@/components/ui/button";
import SearchHistory from "@/components/Individual/search-history";
import Search from "@/components/common/search";
import { useEffect, useState } from "react";
import { useUser } from "@/context/usercontext";
import { fetchAgentsWithSearchCount } from "@/components/service/broker";
import BecomeMemberModal from "@/components/Modal/BecomeMemberModal";
import PaymentMethodModal from "@/components/Modal/PaymentMethodModal";
import SubscriptionSuccessModal from "@/components/Modal/SubscriptionSuccessModal";
import SubscriptionFailedModal from "@/components/Modal/SubscriptionFailedModal";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import IndividualBilling from "./individual-billing";


import { useUserIdType } from "@/hooks/useUserIdType";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import { listTotalAuditLogsByUserId, listTotalSearchesByUserId } from "@/components/service/userAdmin";

const IndividualDashboard = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [searchParams] = useSearchParams();
  const isCardAdded = searchParams.get("isCardAdded");


  const {userId} = useUserIdType();

  const {data: agentSearches} = useQuery({
    queryKey: [queryKeys.listTotalSearchesByUserId],
    queryFn: () => listTotalSearchesByUserId(userId),
    skip: !userId
  })

  const {data: agentAuditLogs} = useQuery({
    queryKey: [queryKeys.listTotalAuditLogsByUserId],
    queryFn: () => listTotalAuditLogsByUserId(userId),
    skip: !userId
  })


  useEffect(() => {
    if(isCardAdded) {
      setPaymentModal(false);
      setPaymentSuccessModal(true);
      // setTimeout(() => setPaymentSuccessModal(false), 3000)
    }
  }, [isCardAdded])
  const {
    user,
    memberModal,
    setMemberModal,
    setPaymentModal,
    paymentModal,
    setPaymentSuccessModal,
    paymentSuccessModal,
    setPaymentFailedModal,
    paymentFailedModal,
  } = useUser();

  useEffect(() => {
    fetchAgentsWithSearchCount(user.attributes.sub).then((res) =>
      setAgents(res || [])
    );
  }, []);

  const totalAgents = agents.length;
  const activeAgents = agents.filter(
    (agent) => agent.status === "ACTIVE"
  ).length;
  const inactiveAgents = agents.filter(
    (agent) => agent.status === "INACTIVE"
  ).length;
  return (
    <div className="my-4">
      {/* cards */}
      <div className="grid grid-cols-2 md:grid-cols-2  gap-5 *:rounded-2xl *:bg-[#F5F0EC] mb-4">
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-coffee-light font-medium"> Total Search</p>
            <p className="text-4xl font-semibold text-tertiary">
              {agentSearches?.data?.totalSearches}
            </p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            <img src="/t-search.svg" alt="total-search" className="w-6 h-6"/>
          </div>
        </div>
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-coffee-light font-medium"> Audit Logs</p>
            <p className="text-4xl font-semibold text-tertiary">
              {agentAuditLogs?.data?.totalAuditLogs}
            </p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            <img src="/audit-log.svg" alt="audit-log" className="w-6 h-6"/>
          </div>
        </div>
      </div>

      <Search isIndivisual={true}/>

      <div className="bg-[#F5F0EC] p-6 rounded-2xl ">
        <div className="flex justify-between items-center gap-4 mb-6">
          <p className="text-secondary font-medium text-xl">Search History</p>
          <Link to="/individual/dashboard/search-history">
            <Button
              variant="outline"
              >
              View More
            </Button>
          </Link>
        </div>
        <SearchHistory />
      </div>
      {/* <IndividualBilling /> */}

      {/* {paymentModal && (
        <PaymentMethodModal
          open={paymentModal}
          onOpenChange={() => setPaymentModal(false)}
          onSuccess={() => setPaymentSuccessModal(true)}
          isAddCard={true}
        />
      )}
      {paymentSuccessModal && (
        <SubscriptionSuccessModal
          open={paymentSuccessModal}
          onOpenChange={() => setPaymentSuccessModal(false)}
          onFailed={() => setPaymentFailedModal(true)}
        />
      )}

      {paymentFailedModal && (
        <SubscriptionFailedModal
          open={paymentFailedModal}
          onOpenChange={() => setPaymentFailedModal(false)}
        />
      )} */}
      {/* {memberModal && (
        <BecomeMemberModal
          open={memberModal}
          onClose={() => setMemberModal(false)}
          setPaymentModal={setPaymentModal}
        />
      )}
      {paymentModal && (
        <PaymentMethodModal
          open={paymentModal}
          onOpenChange={() => setPaymentModal(false)}
          onSuccess={() => setPaymentSuccessModal(true)}
        />
      )}
      {paymentSuccessModal && (
        <SubscriptionSuccessModal
          open={paymentSuccessModal}
          onOpenChange={() => setPaymentSuccessModal(false)}
          onFailed={() => setPaymentFailedModal(true)}
        />
      )}

      {paymentFailedModal && (
        <SubscriptionFailedModal
          open={paymentFailedModal}
          onOpenChange={() => setPaymentFailedModal(false)}
        />
      )} */}
    </div>
  );
};

export default IndividualDashboard;
