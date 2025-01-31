import { API } from "aws-amplify";
import { useState, useEffect } from "react";
import { listAuditLogs } from "../../../graphql/queries";
import "./index.css";
import { useUser } from "../../../context/usercontext";
import { FETCH_LIMIT, getFormattedDateTime } from "../../../utils";

function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState(null);
  const [activeTab, setActiveTab] = useState("history");
  const { user } = useUser();

  const fetchLogs = async (value) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await API.graphql({
        query: listAuditLogs,
        variables: {
          filter: { isAgent: { eq: value } },
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

  const resetStateOnTabChange = () => {
    setHasMore(true);
    setLoading(false);
    setNextToken(null);
    setLogs([]);
  };

  useEffect(() => {
    if (user?.attributes?.sub) {
      if (activeTab === "history") fetchLogs(false);
      else fetchLogs(true);
    }
  }, [user, activeTab]);

  return (
    <div className="history-main-content">
      <div class="setting-page-title">
        <h1>Agent Audit Logs</h1>
      </div>
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => {
            resetStateOnTabChange();
            setActiveTab("history");
          }}
        >
          Brokers
        </button>
        <button
          className={`tab-button ${activeTab === "agents" ? "active" : ""}`}
          onClick={() => {
            resetStateOnTabChange();
            setActiveTab("agents");
          }}
        >
          Agents
        </button>
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
          <button
            className="loadmore"
            onClick={() => fetchLogs(activeTab === "history" ? false : true)}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminAuditLogs;
