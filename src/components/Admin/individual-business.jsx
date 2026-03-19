import { ArrowDownToLine, Loader2 } from "lucide-react";
import DateFilter from "../common/date-filter";
import { Button } from "../ui/button";
import IndividualBusinessTable from "./agent-business-table";
import BackBtn from "../back-btn";
import { useState } from "react";
import { getAdminMetrics } from "../service/userAdmin";
import { useQuery } from "@tanstack/react-query";
const userTimezone  = Intl.DateTimeFormat().resolvedOptions().timeZone;
export default function OrganisationAgentBusiness() {
   const [isDownload, setIsDoownload] = useState(false);
   const [date, setDate] = useState({from: null, to: null});
   const metricQuery = useQuery({
    queryKey: ['admin-metrics', "all_time", userTimezone],
    queryFn: () => getAdminMetrics({admin_dashboard_global_filter: "all_time", userTimezone })
  })
  console.log("metricQuery",metricQuery?.data)
    return(
            <>
              <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
                <BackBtn />
              </div>
              <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
                <div className="flex justify-between items-center gap-4 mb-6">
                  <div className="flex items-center gap-6">
                    <p className="text-secondary font-medium text-xl">Business</p>
                    <p
                      className={`bg-white text-tertiary font-semibold text-lg transition-all rounded-full px-10 py-3 `}
                    >
                      {metricQuery?.isSuccess && <span>${metricQuery?.data?.agentRevenueResults ?? "--"}</span>}
                      {metricQuery?.isLoading && <Loader2 className="w-6 h-10 animate-spin text-secondary" />}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <DateFilter handleFilter={(from, to) => setDate(pre => ({...pre, from, to}))}/>
                    <Button variant="outline" onClick={() => setIsDoownload(true)}>
                      <ArrowDownToLine /> Download CSV
                    </Button>
                  </div>
                </div>
                <div className="bg-white !p-4 rounded-xl">
                    <IndividualBusinessTable isDownload={isDownload} handleDownloadComplete={() => setIsDoownload(false)} from={date?.from} to={date?.to} />
                  {/* {!hasMore && <p>No more data to load.</p>}
                  {logs?.length > 0 && hasMore && !loading && (
                    <button className="loadmore mt-4">Load More</button>
                  )} */}
                </div>
              </div>
            </>
    )
}