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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DateFilter from "../common/date-filter";
import BackBtn from "../back-btn";
import BrokerBusinessTable from "./broker-business-table";

export default function BrokerBusiness() {
  const [isDownload, setIsDoownload] = useState(false);
  const [date, setDate] = useState({from: null, to: null});
  console.log("date", date);
  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
        {/* <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
          </button>
          <p className="text-lg text-secondary">Back</p>
        </div> */}
      </div>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-6">
            <p className="text-secondary font-medium text-xl">Business</p>
            <p
              className={`bg-white text-tertiary font-semibold text-lg transition-all rounded-full px-10 py-3 `}
            >
              $260.00
            </p>
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
          {/* {!hasMore && <p>No more data to load.</p>}
          {logs?.length > 0 && hasMore && !loading && (
            <button className="loadmore mt-4">Load More</button>
          )} */}
        </div>
      </div>
    </>
  );
}

