import { ArrowDownToLine, BookUser, HatGlasses, Loader2, Map, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeFilter from "../common/time-filter";
import { useState } from "react";
import DateFilter from "../common/date-filter";
import BrokerIndividualBusiness from "./broker-individual-business";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdminMetrics } from "../service/userAdmin";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history");
  const [resetChildState, setResetChildState] = useState(null);
  const metricQuery = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: getAdminMetrics
  })
  const handleTabChange = () => {
    if (resetChildState) {
      resetChildState(); // call child function
    }
  };
  //   const [agents, setAgents] = useState([]);

  //    const { user } = useUser();

  //   useEffect(() => {
  //       fetchAgentsWithSearchCount(user.attributes.sub).then(res => setAgents(res || []))
  //   }, [])

  //   const totalAgents = agents.length
  //   const activeAgents = agents.filter(agent => agent.status === "ACTIVE").length
  //   const inactiveAgents = agents.filter(agent => agent.status === "INACTIVE").length

  //   console.log({totalAgents, activeAgents, inactiveAgents})

  return (
    <div className="my-4">
      <TimeFilter />
      {/* cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 *:rounded-2xl *:bg-[#F5F0EC] my-4">
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-secondary"> Total Brokers</p>
            {metricQuery?.isSuccess && 
            <p className="text-4xl font-semibold text-tertiary">
              {metricQuery?.data?.results?.BROKER ?? "--"}
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
            {metricQuery?.isSuccess && <p className="text-4xl font-semibold text-tertiary">{metricQuery?.data?.results?.AGENT ?? "--"}</p>}
            {metricQuery?.isLoading && <Loader2 className="w-6 h-10 animate-spin text-secondary" />}
          </div>
          <div className="bg-white rounded-full p-3.5">
            {/* <HatGlasses className="text-tertiary" /> */}
             <img src="/user-check.svg" alt="user-check-icon" className="w-6 h-6" />
          </div>
        </div>
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-secondary"> Total Counties</p>
            <p className="text-4xl font-semibold text-tertiary">0</p>
          </div>
          <div className="bg-white rounded-full p-3.5">
            {/* <Map className="text-tertiary" /> */}
             <img src="/map-location-pin.svg" alt="map-location-pin-icon" className="w-6 h-6" />
          </div>
        </div>
        <div className="p-5 flex justify-between items-end ">
          <div>
            <p className="mb-4 text-secondary"> Demo Requests</p>
            <p className="text-4xl font-semibold text-tertiary">0</p>
          </div>
          <div className="bg-white rounded-full p-3.5">
             {/* <BookUser className="text-tertiary" /> */}
             <img src="/request-approval.svg" alt="request-approval-icon" className="w-6 h-6" /> 
          </div>
        </div>
      </div>

      {/* Search */}
      {/* <Search /> */}

      <div className="space-x-3 flex justify-between items-center mb-4">
        <div className="space-x-3">
          <button
            className={` ${
              activeTab === "history"
                ? "bg-tertiary text-white"
                : "bg-[#F5F0EC] hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
            } transition-all  rounded-full px-10 py-3 `}
            onClick={() => {
              // resetStateOnTabChange();
              handleTabChange();
              setActiveTab("history");
            }}
          >
            Brokers
          </button>
          <button
            className={` ${
              activeTab === "individual"
                ? "bg-tertiary text-white"
                : "bg-[#F5F0EC] hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
            } transition-all  rounded-full px-10 py-3 `}
            onClick={() => {
              // resetStateOnTabChange();
              handleTabChange();
              setActiveTab("individual");
            }}
          >
            Individual
          </button>
        </div>
        <DateFilter />
      </div>

      <div className="bg-[#F5F0EC] px-6 py-4 rounded-2xl ">
        <div className="flex justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-6">
            <p className="text-secondary font-medium text-xl">
              {activeTab === "history" ? "Business" : "Total Bussiness"}
            </p>
            <p
              className={`bg-white text-tertiary font-semibold text-lg transition-all rounded-full px-10 py-3 `}
            >
              $260.00
            </p>
          </div>
          <div className="flex justify-between items-center gap-2">
          <Button variant="outline"><ArrowDownToLine /> Download CSV</Button>
          <Link to={activeTab === "history" ? "/admin/broker-business" : "/admin/individual-business"}>
          <Button variant="outline"> View More </Button>
          </Link>
          </div>
        </div>
        <BrokerIndividualBusiness
          activeTab={activeTab}
          onRegisterReset={setResetChildState}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
