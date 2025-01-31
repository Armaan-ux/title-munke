import { useEffect, useState } from "react";
import AddUserModal from "../../Modal/AddUserModal";
import {
  calculateAverage,
  getAgentsTotalSearchesThisMonth,
  getTopPerformerAgent,
  inActiveAgent,
  pendingAgentSearch,
  UnassignAgent,
} from "../../service/agent";
import { useUser } from "../../../context/usercontext";
import { fetchAgentsWithSearchCount } from "../../service/broker";
import "./index.css";
import { resendOTP } from "../../service/auth";
import { getFormattedDateTime, handleCreateAuditLog } from "../../../utils";
import { toast } from "react-toastify";

const AssginedAgents = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [totalSearchesThisMonth, setTotalSearchesThisMonth] = useState(0);
  const [pendingSearch, setPendingSearch] = useState(0);
  const [topPerformer, setTopPerformer] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [totalSearches, agents, pendingSearches, topPerformer] =
          await Promise.all([
            getAgentsTotalSearchesThisMonth(user.attributes.sub),
            fetchAgentsWithSearchCount(user.attributes.sub),
            pendingAgentSearch(user.attributes.sub),
            getTopPerformerAgent(user.attributes.sub),
          ]);

        setTotalSearchesThisMonth(totalSearches.totalSearches);
        setAgents(agents);
        setPendingSearch(pendingSearches.pendingSearches);
        setTopPerformer(topPerformer);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.attributes?.sub) fetchData();
  }, [user]);

  const unAssignAgent = async (id, agentId) => {
    const result = await UnassignAgent(id, agentId);
    if (result) {
      setAgents(agents.filter((elem) => elem.id !== id));
      toast.success("Agent UnAssigned Successfully.");
      handleCreateAuditLog("UNASSIGN", {
        detial: `Unassigned Agent ${agentId}`,
      });
    }
  };

  const inActiveAgentStatus = async (id) => {
    const result = await inActiveAgent(id);
    if (result) {
      const temp = agents;
      const indx = temp.findIndex((elem) => elem.agentId === id);
      temp[indx] = {
        ...temp[indx],
        status: temp[indx].status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
      };
      setAgents(temp.map((e) => e));
      toast.success("Agent InActive Successfully.");
      handleCreateAuditLog("ACTIVE_STATUS", {
        detial: `Convert Agent ${id} Status to INACTIVE`,
      });
    }
  };

  return (
    <>
      {isOpen && (
        <AddUserModal
          setIsOpen={setIsOpen}
          userType="agent"
          setUser={setAgents}
        />
      )}
      <div className="main-content" style={{ display: "block" }}>
        <div
          className="page-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignIitems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ marginLeft: "20px" }}>Broker Management</h1>
          <div className="action-buttons">
            <button
              onClick={() => setIsOpen(true)}
              className="btn add-user-btn"
            >
              <i className="fas fa-user-plus"></i> Add User
            </button>
          </div>
        </div>

        <div className="widgets">
          <div className="widget">
            <h4>Team Performance Overview</h4>
            <p>
              <strong>Total Searches This Month:</strong>{" "}
              {loading ? "loading...." : totalSearchesThisMonth}
            </p>
            <p>
              <strong>Average Searches per Agent:</strong>{" "}
              {loading
                ? "loading...."
                : (totalSearchesThisMonth > 0 &&
                    agents.length > 0 &&
                    calculateAverage(totalSearchesThisMonth, agents.length)) ||
                  0}
            </p>
            <p>
              <strong>Top Performer:</strong>{" "}
              {loading ? "loading...." : topPerformer}
            </p>
          </div>

          <div className="widget">
            <h4>In Progress Searches</h4>
            <p>
              <strong>Total Pending Searches:</strong>{" "}
              {loading ? "loading...." : pendingSearch}
            </p>
            <p></p>
          </div>
        </div>

        <div className="assigned-agent-card" style={{ width: "98%" }}>
          <h3>Assigned Agents</h3>
          <table className="assigned-agent-styled-table table-container">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Searches This Month</th>
                <th>Last login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <p style={{ display: "flex" }}>Loading.....</p>
              ) : agents?.length === 0 ? (
                <p style={{ display: "flex" }}>No Records Found.</p>
              ) : (
                agents?.map((elem) => (
                  <>
                    <tr id="broker-row-1">
                      <td>{elem.agentName}</td>
                      <td>
                        <span className="status active">{elem.status}</span>
                      </td>
                      <td>{elem.totalSearches}</td>
                      <td>{getFormattedDateTime(elem.lastLogin)}</td>
                      <td>
                        <div className="dropdown">
                          <button className="btn action-btn">
                            Actions <i className="fas fa-caret-down"></i>
                          </button>
                          {elem.status === "UNCONFIRMED" ? (
                            <div className="dropdown-content">
                              <span onClick={() => resendOTP(elem.agentName)}>
                                Resend OTP
                              </span>
                            </div>
                          ) : (
                            <div className="dropdown-content">
                              <span
                                onClick={() =>
                                  unAssignAgent(elem.id, elem.agentId)
                                }
                              >
                                Unassign
                              </span>
                              <span
                                onClick={() =>
                                  inActiveAgentStatus(elem.agentId)
                                }
                              >
                                {elem.status === "ACTIVE"
                                  ? "Inactive"
                                  : "Active"}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssginedAgents;
