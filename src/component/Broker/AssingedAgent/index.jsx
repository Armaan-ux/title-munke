import { useCallback, useEffect, useState } from "react";
import AddUserModal from "../../Modal/AddUserModal";
import {
  calculateAverage,
  // getTopPerformerAgent,
  // inActiveAgent,
  // pendingAgentSearch,
  // UnassignAgent,
} from "../../service/agent";
import {
    reinviteAgent,
    getAgentsTotalSearches,
    CONSTANTS,
    updateAgentStatus,
    getPendingAgentSearches,
    undeleteUser,
    deleteUser,
    UnassignAgent,
    getTopPerformerAgent,
    } from "../../service/userAdmin";
import { useUser } from "../../../context/usercontext";
import { fetchAgentsWithSearchCount } from "../../service/broker";
import "./index.css";
import { getFormattedDateTime, handleCreateAuditLog } from "../../../utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignedAgents = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [totalSearchesThisMonth, setTotalSearchesThisMonth] = useState(0);
  const [reinvitingAgentId, setReinvitingAgentId] = useState(null);
  const [deletingAgentId, setDeletingAgentId] = useState(null);
  const [undeletingAgentId, setUndeletingAgentId] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [pendingSearch, setPendingSearch] = useState(0);
  const [topPerformer, setTopPerformer] = useState("");

  const fetchData = useCallback(async () => {
    if (user?.attributes?.sub) {
      setLoading(true);
      try {
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);
        const nextMonthStart = new Date(currentMonthStart);
        nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

        const [totalSearches, agents, pendingSearches, topPerformerObj] =
          await Promise.all([
            getAgentsTotalSearches(user.attributes.sub, currentMonthStart, nextMonthStart),
            fetchAgentsWithSearchCount(user.attributes.sub),
            getPendingAgentSearches(user.attributes.sub),
            getTopPerformerAgent(user.attributes.sub),
          ]);

        let topPerformerText = "No Top Performer";
        const performer = topPerformerObj?.topPerformer;

        if (performer) {
          topPerformerText = `${performer.agentName || "None"} (${
            performer.searchCount || 0
          })`;
        }
        setTotalSearchesThisMonth(totalSearches.totalSearches);
        setAgents(agents);
        setPendingSearch(pendingSearches.pendingSearches);
        setTopPerformer(topPerformerText);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user?.attributes?.sub) {
      fetchData();
      const interval = setInterval(fetchData, 1800000);

      return () => clearInterval(interval);
    }
  }, [user, fetchData]);

  useEffect(() => {
    if (agents) {
      const filtered = showDeleted
        ? agents
        : agents.filter((agent) => agent.status !== CONSTANTS.USER_STATUS.DELETED);
      setFilteredAgents(filtered);
    }
  }, [agents, showDeleted]);

  const unAssignAgent = async (agentId) => {
    const result = await UnassignAgent(agentId);
    if (result) {
      setAgents((prevAgents) => prevAgents.filter((elem) => elem.agentId !== agentId));
      toast.success("Agent UnAssigned Successfully.");
      handleCreateAuditLog("UNASSIGN", {
        detail: `Unassigned Agent ${agentId}`,
      });
    }
  };

  const toggleAgentStatus = async (id, status) => {
    const result = await updateAgentStatus(id, status);
    if (result) {
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.agentId === id ? { ...agent, status: status } : agent
        )
      );
      toast.success(`Agent ${status} Successfully.`);
      handleCreateAuditLog("ACTIVE_STATUS", {
        detail: `Convert Agent ${id} Status to ${status}`,
      });
    }
  };

  const handleReinvite = async (agent) => {
    setReinvitingAgentId(agent.id);
    const result = await reinviteAgent(agent);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error || "Failed to reinvite agent.");
    }
    setReinvitingAgentId(null);
  };

  const handleDelete = async (agent) => {
    if (window.confirm(`Are you sure you want to delete agent ${agent.agentName}? This is a soft delete.`)) {
      setDeletingAgentId(agent.id);
      try {
        await deleteUser(agent.id, agent.email, CONSTANTS.USER_TYPES.AGENT);
        toast.success(`Agent ${agent.agentName} has been deleted.`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete agent:", error);
        toast.error(`Failed to delete agent. ${error?.response?.data?.message || ""}`);
      } finally {
        setDeletingAgentId(null);
      }
    }
  };

  const handleUndelete = async (agent) => {
    if (window.confirm(`Are you sure you want to restore agent ${agent.agentName}?`)) {
      setUndeletingAgentId(agent.id);
      try {
        await undeleteUser(agent.id, agent.email, CONSTANTS.USER_TYPES.AGENT);
        toast.success(`Agent ${agent.agentName} has been restored.`);
        fetchData();
      } catch (error) {
        console.error("Failed to restore agent:", error);
        toast.error(`Failed to restore agent. ${error?.response?.data?.message || ""}`);
      } finally {
        setUndeletingAgentId(null);
      }
    }
  };


  return (
    <>
      {isOpen && (
        <AddUserModal
          setIsOpen={setIsOpen}
          userType="agent"
          setUser={setAgents}
          agents={agents} // Pass agents to check for duplicates
        />
      )}
      <div className="main-content" style={{ display: "block" }}>
        <div
          className="page-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
                <th>Reinvite</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <p style={{ display: "flex" }}>Loading.....</p>
              ) : agents?.length === 0 ? (
                <p style={{ display: "flex" }}>No Records Found.</p>
              ) : (
                agents?.map((elem) => (
                  <tr key={elem.id} id={`broker-row-${elem.id}`}>
                    <td>{elem.agentName}</td>
                    <td>
                      <span className={`status ${elem.status?.toLowerCase()}`}>
                        {elem.status}
                      </span>
                    </td>
                    <td>{elem.totalSearches}</td>
                    <td>{getFormattedDateTime(elem.lastLogin)}</td>
                    <td>
                      <div className="dropdown">
                        {elem.status !== "UNCONFIRMED" && (
                          <>
                            <button className="btn action-btn">
                              Actions <i className="fas fa-caret-down"></i>
                            </button>

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
                                  toggleAgentStatus(
                                    elem.agentId,
                                    elem.status === "INACTIVE"
                                      ? "ACTIVE"
                                      : "INACTIVE"
                                  )
                                }
                              >
                                {elem.status === "ACTIVE"
                                  ? "Inactive"
                                  : "Active"}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        className={`reinvite-btn ${
                          reinvitingAgentId === elem.id ? "reinviting" : ""
                        }`}
                        disabled={
                          elem.status !== "UNCONFIRMED" || !!reinvitingAgentId
                        }
                        onClick={() => handleReinvite(elem)}
                      >
                        {reinvitingAgentId === elem.id
                          ? "Sending..."
                          : "Reinvite"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssignedAgents;