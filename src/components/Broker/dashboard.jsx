import Search from "@/components/common/search";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/usercontext";
import { useUserIdType } from "@/hooks/useUserIdType";
import { queryKeys } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import {
  UserRound,
  UserRoundCheck,
  UserRoundX
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAgentsWithSearchCount } from "../service/broker";
import { getBrokerDetails, getCheckCardIsAdded } from "../service/userAdmin";
import BrokerHistory from "./broker-history";

const BrokerDashboard = () => {
  const navigate =  useNavigate()
  const [agents, setAgents] = useState([]);
    const {userId,userType} = useUserIdType();

  const {
    user,
    setPaymentModal,

    setCardListingModal,
    setNewPlanType
  } = useUser();

  const brokerDetailQuery = useQuery({
    queryKey: ["brokerDetail", userId],
    queryFn: () => getBrokerDetails(userId),
    enabled: userType === "broker" && !!userId,
    staleTime: 1 * 60 * 1000,
  });
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
    (agent) => agent.status === "UNCONFIRMED"
  ).length;
    const {data: iscardAddedForUser} = useQuery({
    queryKey: [queryKeys.getCheckCardIsAdded],
    queryFn: () => getCheckCardIsAdded(userId),
    enabled: !!userId
  })
useEffect(() => {
  const plan = brokerDetailQuery?.data?.planType;
  const isCardAdded = iscardAddedForUser?.isCardAdded;

  if (!plan || isCardAdded !== false) return;

  localStorage.setItem("planType", plan);

  let timer;

  if (plan === "PROFESSIONAL_PLAN") {
    timer = setTimeout(() => {
      setPaymentModal(true);
        setNewPlanType("PROFESSIONAL_PLAN")
    }, 2000);
  } else if (plan === "PAY_AS_YOU_GO") {
    timer = setTimeout(() => {
      setCardListingModal(true);
      setNewPlanType("PAY_AS_YOU_GO")
    }, 2000);
  }

  return () => {
    if (timer) clearTimeout(timer);
  };
}, [brokerDetailQuery?.data?.planType, iscardAddedForUser?.isCardAdded]);

  return (
    <div className="my-4">
      {/* cards */}
      <div className="grid grid-cols-2 md:grid-cols-3  gap-5 *:rounded-2xl *:bg-[#F5F0EC] mb-4">
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-secondary"> Total Agents</p>
            <p className="text-4xl font-semibold text-tertiary">
              {totalAgents}
            </p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            <UserRound className="text-tertiary" />
          </div>
        </div>
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-secondary"> Active Agents</p>
            <p className="text-4xl font-semibold text-tertiary">
              {activeAgents}
            </p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            <UserRoundCheck className="text-tertiary" />
          </div>
        </div>
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-secondary"> Inactive Agents</p>
            <p className="text-4xl font-semibold text-tertiary">
              {inactiveAgents}
            </p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            <UserRoundX className="text-tertiary" />
          </div>
        </div>
      </div>

      {/* Search */}
      <Search />

      <div className="bg-[#F5F0EC] p-6 rounded-2xl ">
        <div className="flex justify-between items-center gap-4 mb-6">
          <p className="text-secondary font-medium text-xl">Search History</p>
          <Link to="/broker/dashboard/search-history">
          <Button variant="outline" > View More </Button>
          </Link>
        </div>

        <BrokerHistory />
      </div>

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
      {true && (
        <CardAddedSuccessModal
          open={true}
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

export default BrokerDashboard;
