import { ArrowDownToLine, HatGlasses, Loader2, Map, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeFilter from "../common/time-filter";
import { useState } from "react";
import BrokerIndividualBusiness from "./broker-individual-business";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrganisationMetrics } from "../service/userAdmin";
const userTimezone  = Intl.DateTimeFormat().resolvedOptions().timeZone;

const OrganisationDashboard = () => {
  
  const [isDownload, setIsDoownload] = useState(false);
  const [activeTab, setActiveTab] = useState("broker");
    const [active, setActive] = useState("all_time");

  const [resetChildState, setResetChildState] = useState(null);
   const metricQuery = useQuery({
      queryKey: ['organisation-metrics', active, userTimezone],
      queryFn: () => getOrganisationMetrics({organisation_dashboard_global_filter: active, userTimezone })
    })
  const handleTabChange = () => {
    if (resetChildState) {
      resetChildState();
    }
  };

  return (
    <div className="my-4">
              <TimeFilter active={active} setActive={(value) => setActive(value)}/>
                {/* cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 *:rounded-2xl *:bg-[#F5F0EC] my-8">
                  <div className="p-5 flex justify-between items-end ">
                    <div>
                      <p className="mb-4 text-secondary"> Total Brokers</p>
                      {metricQuery?.isSuccess && 
                      <p className="text-4xl font-semibold text-tertiary">
                        {metricQuery?.data?.totalBrokerCount ?? "--"}
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
                      {metricQuery?.isSuccess && <p className="text-4xl font-semibold text-tertiary">{metricQuery?.data?.totalAgentCount ?? "--"}</p>}
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
                      {metricQuery?.isSuccess && <p className="text-4xl font-semibold text-tertiary">{metricQuery?.data?.pendingRequests ?? "--"}</p>}
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
                      {metricQuery?.isSuccess && <p className="text-4xl font-semibold text-tertiary">{metricQuery?.data?.acceptedRequests ?? "--"}</p>}
                      {metricQuery?.isLoading && <Loader2 className="w-6 h-10 animate-spin text-secondary" />}
                    </div>
                    <div className="bg-white rounded-full p-3.5">
                       {/* <BookUser className="text-tertiary" /> */}
                       <img src="/request-approval.svg" alt="request-approval-icon" className="w-6 h-6" /> 
                    </div>
                  </div>
                </div>
      <div className="space-x-3 flex justify-between items-center mb-4">
        <div className="space-x-3">
          <button
            className={` ${
              activeTab === "broker"
                ? "bg-tertiary text-white"
                : "bg-[#F5F0EC] hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
            } transition-all  rounded-full px-10 py-3 `}
            onClick={() => {
              // resetStateOnTabChange();
              handleTabChange();
              setActiveTab("broker");
            }}
          >
            Brokers
          </button>
          <button
            className={` ${
              activeTab === "agent"
                ? "bg-tertiary text-white"
                : "bg-[#F5F0EC] hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
            } transition-all  rounded-full px-10 py-3 `}
            onClick={() => {
              // resetStateOnTabChange();
              handleTabChange();
              setActiveTab("agent");
            }}
          >
            Agents
          </button>
        </div>
        {/* <DateFilter /> */}
      </div>

      <div className="bg-[#F5F0EC] px-6 py-4 rounded-2xl ">
        <div className="flex justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-6">
            <p className="text-secondary font-medium text-xl">
              {activeTab === "broker" ? "Broker" : "Agent"} 
            </p>
          </div>
          <div className="flex justify-between items-center gap-2">
          <Button variant="outline" onClick={() => setIsDoownload(true)}><ArrowDownToLine /> Download CSV</Button>
          <Link to={activeTab === "broker" ? "/organisation/dashboard/broker-business" : "/organisation/dashboard/individual-business"}>
          <Button variant="outline"> View More </Button>
          </Link>
          </div>
        </div>
        <BrokerIndividualBusiness
          activeTab={activeTab}
          onRegisterReset={setResetChildState}
          isDownload={isDownload}
          handleDownloadComplete={() => setIsDoownload(false)}         
        />
      </div>
    </div>
  );
};

export default OrganisationDashboard;
