
import { FileSearch2, Logs } from "lucide-react";
import { Button } from "@/components/ui/button";
import History from "@/components/common/history";
import Search from "@/components/common/search";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import { getCheckCardIsAdded, listTotalAuditLogsByUserId, listTotalSearchesByUserId } from "@/components/service/userAdmin";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useUser } from "@/context/usercontext";
import { useEffect } from "react";

const AgentDashboard = () => {
  const {agentDetail} = useUser();

  const {userId} = useUserIdType();
  const {
    setPaymentModal,
    setCardListingModal
  } = useUser();
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

    const {data: iscardAddedForUser} = useQuery({
    queryKey: [queryKeys.getCheckCardIsAdded],
    queryFn: () => getCheckCardIsAdded(userId),
    enabled: !!userId
  })
  console.log("is card added for user: ", iscardAddedForUser, agentDetail);


useEffect(() => {
  const plan = agentDetail?.planType;
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
}, [agentDetail?.planType, iscardAddedForUser?.isCardAdded]);

  return (
    <div className="my-4" >

        {/* cards */}
        <div className="flex *:basis-1/2 gap-5 *:rounded-2xl *:bg-[#F5F0EC] mb-4" >
          <div className="p-5 flex justify-between items-end " >
            <div>
              <p className="mb-4 text-secondary" > Total Searches</p>
              <p className="text-4xl font-semibold text-tertiary" >{agentSearches?.data?.totalSearches}</p>
            </div>
            <div className="bg-white rounded-full p-3.5" >
              <FileSearch2 className="text-tertiary" />
            </div>
          </div>
          <div className="p-5 flex justify-between items-end " >
            <div>
              <p className="mb-4 text-secondary" > Audit Logs</p>
              <p className="text-4xl font-semibold text-tertiary" >{agentAuditLogs?.data?.totalAuditLogs}</p>
            </div>
            <div className="bg-white rounded-full p-3.5" >
              <Logs className="text-tertiary" />
            </div>
          </div>
        </div>

        {/* Search */}
        <Search />


        <div className="bg-[#F5F0EC] p-6 rounded-2xl " >
          <div className="flex justify-between items-center gap-4 mb-6" >
            <p className="text-secondary font-medium text-xl" >Search History</p>
            <Link to="/agent/dashboard/search-history">
            <Button variant="outline" > View More </Button>
            </Link>
          </div>

            <History />

        </div>

    </div>

  );
};

export default AgentDashboard;
