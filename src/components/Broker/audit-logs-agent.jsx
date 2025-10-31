import { useState, useEffect } from "react";
import { listAuditLogs } from "@/graphql/queries";
// import "./index.css";
import { useUser } from "@/context/usercontext";
import { getFormattedDateTime } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBrokerAgentsDetails } from "../service/userAdmin";

function AuditLogsAgent() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const { user } = useUser();

  const fetchLogs = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const agentsData = await getBrokerAgentsDetails(user?.attributes?.sub);
      if (agentsData.length === 0) {
        setLoading(false);
        return;
      }
      const response = await listAuditLogs({
        userIds: agentsData.map((elem) => elem.agentId),
        nextToken: nextToken,
      });
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

  useEffect(() => {
    if (user?.attributes?.sub) fetchLogs();
  }, [user]);

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        <Table className="">
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              {/* <TableHead>Action</TableHead> */}
              <TableHead>Details</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Time</TableHead>
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
                  {/* <TableCell className="font-medium">{item.action}</TableCell> */}
                  <TableCell>{item?.detail?.replace(/[{}"]/g, "")}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{getFormattedDateTime(item?.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!hasMore && <p>No more data to load.</p>}
        {logs?.length > 0 && hasMore && !loading && (
          <button className="loadmore" onClick={fetchLogs}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default AuditLogsAgent;
