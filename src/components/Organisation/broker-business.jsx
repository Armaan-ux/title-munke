import { useState } from "react";
// import "./index.css";
import { getFormattedDateTime } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Link,
  Share2,
  Printer,
  Eye,
  ChevronLeft,
  ArrowDownToLine,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DateFilter from "../common/date-filter";
import BackBtn from "../back-btn";
import BrokerBusinessTable from "./broker-business-table";
import { useQuery } from "@tanstack/react-query";
import { getAdminMetrics } from "../service/userAdmin";
const userTimezone  = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function BrokerBusiness() {
  const [isDownload, setIsDoownload] = useState(false);
  const [date, setDate] = useState({from: null, to: null});
  const metricQuery = useQuery({
    queryKey: ['admin-metrics', "all_time", userTimezone],
    queryFn: () => getAdminMetrics({admin_dashboard_global_filter: "all_time", userTimezone })
  })
  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
      </div>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-6">
            <p className="text-secondary font-medium text-xl">Broker</p>
         
          </div>
          <div className="flex justify-between items-center gap-2">
            <DateFilter handleFilter={(from, to) => setDate(pre => ({...pre, from, to}))}/>
            <Button variant="outline" onClick={() => setIsDoownload(true)}>
              <ArrowDownToLine /> Download CSV
            </Button>
          </div>
        </div>
        <div className="bg-white !p-4 rounded-xl">
          <BrokerBusinessTable isDownload={isDownload} handleDownloadComplete={() => setIsDoownload(false)}  from={date?.from} to={date?.to}/>
        </div>
      </div>
    </>
  );
}

