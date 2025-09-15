import { useState, useEffect } from "react";
import { listAuditLogs } from "../../../graphql/queries";
import "./index.css";
import { useUser } from "../../../context/usercontext";
import { getFormattedDateTime } from "../../../utils";
// import { fetchAgentsOfBroker } from "../../service/broker";
import { getBrokerAgentsDetails } from "@/components/service/userAdmin";

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
      const agentsData = await getBrokerAgentsDetails(user?.attributes?.sub);
      if (agentsData.length === 0) {
        setLoading(false);
        return;
      }
      const response = await listAuditLogs({
          userIds: agentsData.map((elem) => elem.agentId),
          nextToken: nextToken
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
    <div className="history-main-content">
      <div className="setting-page-title">
        <h1>Agent Audit Logs</h1>
      </div>
      <div className="history-card">
        <table className="history-styled-table table-container">
          <thead>
            <tr>
              <th>Action</th>
              <th>Detail</th>
              <th>Time</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((elem) => (
              <tr key={elem.id} id="broker-row-1">
                <td>{elem?.action}</td>
                <td> {elem?.detail?.replace(/[{}"]/g, "")}</td>
                <td>{getFormattedDateTime(elem?.createdAt)}</td>
                <td>{elem?.email}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs?.length === 0 && <p>No Records found.</p>}
        {loading && <p>Loading...</p>}
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

export default AuditLogs;
