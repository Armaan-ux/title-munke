import { API } from "aws-amplify";
import { useState, useEffect } from "react";
// import "./index.css";
import { useUser } from "@/context/usercontext";
import { FETCH_LIMIT, getFormattedDateTime } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { listAuditLogsOrg } from "../service/userAdmin";
import { valueFromStringifyObject } from "@/lib/utils";
import { useUserIdType } from "@/hooks/useUserIdType";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const [activeTab, setActiveTab] = useState("organisation");
  const { user } = useUser();
  const { userId } = useUserIdType();

  const fetchLogs = async (value) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await listAuditLogsOrg(activeTab, userId, nextToken, 10);
      const { items, nextToken: newNextToken } = response;

      setLogs((prev) => [...prev, ...items]);
      setNextToken(newNextToken);
      if (items.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(!!newNextToken);
      }
    } catch (error) {
      console.error("Error fetching search histories:", error);
    }
    setLoading(false);
  };

  const resetStateOnTabChange = () => {
    setHasMore(true);
    setLoading(false);
    setNextToken(null);
    setLogs([]);
  };

  useEffect(() => {
    if (user?.attributes?.sub) {
      if (activeTab === "brokers") fetchLogs(false);
      else fetchLogs(true);
    }
  }, [user, activeTab]);

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      <div className="space-x-3 mb-4">
        <button
          className={` ${activeTab === "organisation" ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "} transition-all  rounded-full px-10 py-3 `}
          onClick={() => {
            resetStateOnTabChange();
            setActiveTab("organisation");
          }}
        >
          Organisation
        </button>
        <button
          className={` ${activeTab === "broker" ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "} transition-all  rounded-full px-10 py-3 `}
          onClick={() => {
            resetStateOnTabChange();
            setActiveTab("broker");
          }}
        >
          Brokers
        </button>
        <button
          className={` ${activeTab === "agent" ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "} transition-all  rounded-full px-10 py-3 `}
          onClick={() => {
            resetStateOnTabChange();
            setActiveTab("agent");
          }}
        >
          Agents
        </button>
      </div>

      <div className="bg-white !p-4 rounded-xl">
        <Table className="">
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead className="w-[100px]">Sr. No.</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date & Time</TableHead>
              {/* <TableHead>Action</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.length === 0 && !loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="font-medium text-center py-10 text-muted-foreground"
                >
                  No Records found.
                </TableCell>
              </TableRow>
            ) : (
              logs?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="break-all break-words whitespace-break-spaces max-w-sm min-w-[300px]">
                    {valueFromStringifyObject(item?.detail)}
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{getFormattedDateTime(item?.createdAt)}</TableCell>
                  {/* <TableCell>{item.action}</TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="text-center space-y-2 my-4 text-muted-foreground">
          {loading && <p>Loading...</p>}
          {!hasMore && logs?.length !== 0 && <p>No more data to load.</p>}

          {logs?.length > 0 && hasMore && !loading && (
            <div className="flex justify-center my-4">
              <Button
                className="mx-auto "
                onClick={() => fetchLogs(activeTab === "broker" ? false : true)}
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;
