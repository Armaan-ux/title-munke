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

function BrokerBusinessList() {
  const navigate = useNavigate();
  // const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const logs = [
    {
      id: "1",
      name: "John Doe",
      agent: "Agent A",
      searchCount: "20",
      lastActivity: "2024-06-10 14:30",
      business: "$500.00",
      accountCreated: "2022-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      agent: "Agent B",
      searchCount: "15",
      lastActivity: "2024-06-09 10:15",
      business: "$300.00",
      accountCreated: "2021-11-20",
    },
  ];
  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
          </button>
          <p className="text-lg text-secondary">Back</p>
        </div>
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
            <DateFilter />
            <Button variant="outline">
              <ArrowDownToLine /> Download CSV
            </Button>
          </div>
        </div>
        <div className="bg-white !p-4 rounded-xl">
          <Table className="">
            <TableHeader className="bg-[#F5F0EC]">
              <TableRow>
                <TableHead className="w-[100px]">Sr. No.</TableHead>
                <TableHead>Broker Name</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Search Count</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Account Created</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="font-medium text-center py-10"
                  >
                    No Records found.
                  </TableCell>
                </TableRow>
              ) : (
                logs?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-medium">{item.agent}</TableCell>
                    <TableCell>{item?.searchCount}</TableCell>
                    <TableCell>{item?.lastActivity}</TableCell>
                    <TableCell>{item?.business}</TableCell>
                    <TableCell>{item?.accountCreated}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-row">
                        <Button
                          size="icon"
                          className="text-md"
                          variant="ghost"
                          onClick={() =>
                            navigate("/admin/broker-details/123")
                          }
                        >
                          <Eye />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {!hasMore && <p>No more data to load.</p>}
          {logs?.length > 0 && hasMore && !loading && (
            <button className="loadmore mt-4">Load More</button>
          )}
        </div>
      </div>
    </>
  );
}

export default BrokerBusinessList;
