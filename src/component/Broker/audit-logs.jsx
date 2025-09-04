import { API } from "aws-amplify";
import { useState, useEffect } from "react";
import { listAuditLogs } from "@/graphql/queries";
// import "./index.css";
import { useUser } from "@/context/usercontext";
import { FETCH_LIMIT, getFormattedDateTime } from "@/utils";
import { fetchAgentsOfBroker } from "@/component/service/broker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const { user } = useUser();

  const fetchLogs = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const agentsData = await fetchAgentsOfBroker(user?.attributes?.sub);
      if (agentsData.length === 0) {
        setLoading(false);
        return;
      }
      debugger;
      const response = await API.graphql({
        query: listAuditLogs,
        variables: {
          filter: {
            // isAgent: { eq: true },
            or: agentsData.map((elem) => ({ userId: { eq: elem.agentId } })),
          },
          limit: FETCH_LIMIT,
          nextToken,
        },
      });
      const { items, nextToken: newNextToken } = response.data.listAuditLogs;

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

            {/* <div className="space-x-3 mb-4" >
                <button 
                    className="bg-tertiary text-white rounded-full px-10 py-3"
                 >Brokers
                </button>
                <button
                    className="bg-white hover:bg-coffee-bg-foreground transition-all cursor-pointer text-[#7C6055] rounded-full px-10 py-3"
                >Agents
                </button>
            </div> */}
          
            <div className="bg-white !p-4 rounded-xl" >
    
                <Table className=""  >
                  <TableHeader className="bg-[#F5F0EC]" >
                    <TableRow>
                      <TableHead className="w-[100px]">Sr. No.</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      logs?.length === 0 ?
                      <TableRow >
                        <TableCell colSpan={5} className="font-medium text-center py-10">No Records found.</TableCell>
                      </TableRow>
                      :
                      logs?.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.action}</TableCell>
                          <TableCell>{item?.detail?.replace(/[{}"]/g, "")}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{getFormattedDateTime(item?.createdAt)}</TableCell>
                        </TableRow> 
                      ))
                    }
    
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
    // <div className="history-main-content">
    //   <div className="setting-page-title">
    //     <h1>Agent Audit Logs</h1>
    //   </div>
    //   <div className="history-card">
    //     <table className="history-styled-table table-container">
    //       <thead>
    //         <tr>
    //           <th>Action</th>
    //           <th>Detail</th>
    //           <th>Time</th>
    //           <th>Email</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {logs?.map((elem) => (
    //           <tr key={elem.id} id="broker-row-1">
    //             <td>{elem?.action}</td>
    //             <td> {elem?.detail?.replace(/[{}"]/g, "")}</td>
    //             <td>{getFormattedDateTime(elem?.createdAt)}</td>
    //             <td>{elem?.email}</td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>

    //     {logs?.length === 0 && <p>No Records found.</p>}
    //     {loading && <p>Loading...</p>}
    //     {!hasMore && <p>No more data to load.</p>}

    //     {logs?.length > 0 && hasMore && !loading && (
    //       <button className="loadmore" onClick={fetchLogs}>
    //         Load More
    //       </button>
    //     )}
    //   </div>
    // </div>
  );
}

export default AuditLogs;
