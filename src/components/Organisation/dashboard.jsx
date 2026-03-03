import {
  FileSearch2,
  Loader2,
  Logs,
  Subscript,
  UserRound,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BrokerHistory from "@/components/Broker/broker-history";
import Search from "@/components/common/search";
import { use, useEffect, useState } from "react";
import { useUser } from "@/context/usercontext";
import { fetchAgentsWithSearchCount } from "../service/broker";
import BecomeMemberModal from "@/components/Modal/BecomeMemberModal";
import PaymentMethodModal from "@/components/Modal/PaymentMethodModal";
import SubscriptionSuccessModal from "@/components/Modal/SubscriptionSuccessModal";
import SubscriptionFailedModal from "@/components/Modal/SubscriptionFailedModal";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import CardAddedSuccessModal from "../Modal/CardAddedSuccessModal";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import { getAdminMetrics, getBrokerDetails, getCheckCardIsAdded } from "../service/userAdmin";
import { useUserIdType } from "@/hooks/useUserIdType";
import TimeFilter from "../common/time-filter";

const userTimezone  = Intl.DateTimeFormat().resolvedOptions().timeZone;
const OrganisationDashboard = () => {
  const navigate = useNavigate();
    const [active, setActive] = useState("all_time");
  const [agents, setAgents] = useState([]);
  const { userId, userType } = useUserIdType();

  const { user, setPaymentModal, setCardListingModal, organisationDetail } =
    useUser();

  useEffect(() => {
    fetchAgentsWithSearchCount(user.attributes.sub).then((res) =>
      setAgents(res || []),
    );
  }, []);

    const metricQuery = useQuery({
      queryKey: ['admin-metrics', active, userTimezone],
      queryFn: () => getAdminMetrics({admin_dashboard_global_filter: active, userTimezone })
    })

  const totalAgents = agents.length;
  const activeAgents = agents.filter(
    (agent) => agent.status === "ACTIVE",
  ).length;
  const inactiveAgents = agents.filter(
    (agent) => agent.status === "UNCONFIRMED",
  ).length;
  const { data: iscardAddedForUser } = useQuery({
    queryKey: [queryKeys.getCheckCardIsAdded],
    queryFn: () => getCheckCardIsAdded(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    const plan = organisationDetail?.planType;
    const isCardAdded = iscardAddedForUser?.isCardAdded;
    if (!plan || isCardAdded !== false) return;

    // store planType safely
    localStorage.setItem("planType", plan);

    let timer;

    if (plan === "PROFESSIONAL_PLAN") {
      timer = setTimeout(() => {
        setPaymentModal(true);
      }, 2000);
    } else if (plan === "PAY_AS_YOU_GO") {
      timer = setTimeout(() => {
        setCardListingModal(true);
      }, 2000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [organisationDetail?.planType, iscardAddedForUser?.isCardAdded]);

  return (
    <div className="my-4">
      {/* cards */}
      {/* <div className="grid grid-cols-2 md:grid-cols-3  gap-5 *:rounded-2xl *:bg-[#F5F0EC] mb-4">
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
      </div> */}


          <TimeFilter active={active} setActive={(value) => setActive(value)}/>
            {/* cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 *:rounded-2xl *:bg-[#F5F0EC] my-4">
              <div className="p-5 flex justify-between items-end ">
                <div>
                  <p className="mb-4 text-secondary"> Total Brokers</p>
                  {metricQuery?.isSuccess && 
                  <p className="text-4xl font-semibold text-tertiary">
                    {metricQuery?.data?.BROKER ?? "--"}
                  </p>
                  }
                  {metricQuery?.isLoading && <Loader2 className="w-6 h-10 animate-spin text-secondary" />}
                </div>
                <div className="bg-white rounded-full p-3.5">
                  {/* <UserRound className="text-tertiary" /> */}
                  <img src="/user-shield.svg" alt="user-shield-icon" className="w-6 h-6" />
                </div>
              </div>
              <div className="p-5 flex justify-between items-end ">
                <div>
                  <p className="mb-4 text-secondary">Total Agents</p>
                  {metricQuery?.isSuccess && <p className="text-4xl font-semibold text-tertiary">{metricQuery?.data?.AGENT ?? "--"}</p>}
                  {metricQuery?.isLoading && <Loader2 className="w-6 h-10 animate-spin text-secondary" />}
                </div>
                <div className="bg-white rounded-full p-3.5">
                  {/* <HatGlasses className="text-tertiary" /> */}
                   <img src="/user-check.svg" alt="user-check-icon" className="w-6 h-6" />
                </div>
              </div>
              <div className="p-5 flex justify-between items-end ">
                <div>
                  <p className="mb-4 text-secondary">Pending Request</p>
                  {metricQuery?.isSuccess && <p className="text-4xl font-semibold text-tertiary">{metricQuery?.data?.totalCounties ?? "--"}</p>}
                  {metricQuery?.isLoading && <Loader2 className="w-6 h-10 animate-spin text-secondary" />}
                </div>
                <div className="bg-white rounded-full p-3.5">
                  {/* <Map className="text-tertiary" /> */}
                   <img src="/map-location-pin.svg" alt="map-location-pin-icon" className="w-6 h-6" />
                </div>
              </div>
              <div className="p-5 flex justify-between items-end ">
                <div>
                  <p className="mb-4 text-secondary">Approved Requests</p>
                  {metricQuery?.isSuccess && <p className="text-4xl font-semibold text-tertiary">{metricQuery?.data?.demoRequestCount ?? "--"}</p>}
                  {metricQuery?.isLoading && <Loader2 className="w-6 h-10 animate-spin text-secondary" />}
                </div>
                <div className="bg-white rounded-full p-3.5">
                   {/* <BookUser className="text-tertiary" /> */}
                   <img src="/request-approval.svg" alt="request-approval-icon" className="w-6 h-6" /> 
                </div>
              </div>
            </div>

      {/* Search */}
      <Search />

      <div className="bg-[#F5F0EC] p-6 rounded-2xl ">
        <div className="flex justify-between items-center gap-4 mb-6">
          <p className="text-secondary font-medium text-xl">Search History</p>
          <Link to="/broker/dashboard/search-history">
            <Button variant="outline"> View More </Button>
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

export default OrganisationDashboard;
