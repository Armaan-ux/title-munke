import { useEffect, useState } from "react";
import AddAgentModal from "../../Modal/AddUserModal";
import {
  calculateAverage,
  getAgentsTotalSearchesThisMonth,
  inActiveAgent,
  UnassignAgent,
} from "../../service/agent";
import { useUser } from "../../../context/usercontext";
import { fetchAgentsWithSearchCount } from "../../service/broker";
import "./index.css";

const AssginedAgents = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const [totalSearchesThisMonth, setTotalSearchesThisMonth] = useState(0);

  useEffect(() => {
    getAgentsTotalSearchesThisMonth();
  }, []);

  useEffect(() => {
    if (user?.attributes?.sub)
      getAgentsTotalSearchesThisMonth()
        .then((item) => setTotalSearchesThisMonth(item.totalSearches))
        .catch((err) => console.error(err));
    fetchAgentsWithSearchCount(user?.attributes?.sub)
      .then((item) => setAgents(item))
      .catch((err) => console.error("Error fetching agents", err));
  }, [user]);

  const unAssignAgent = async (id) => {
    const result = await UnassignAgent(id);
    if (result) {
      setAgents(agents.filter((elem) => elem.id !== id));
    }
  };

  const inActiveAgentStatus = async (id) => {
    const result = await inActiveAgent(id);
    if (result) {
      const temp = agents;
      const indx = temp.findIndex((elem) => elem.agentId === id);
      temp[indx] = { ...temp[indx], status: "INACTIVE" };
      setAgents(temp);
    }
  };

  return (
    <>
      {isOpen && <AddAgentModal setIsOpen={setIsOpen} />}
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
            <button className="btn delete-user-btn">
              <i className="fas fa-user-minus"></i> Delete User
            </button>
          </div>
        </div>

        <div className="widgets">
          <div className="widget">
            <h4>Team Performance Overview</h4>
            <p>
              <strong>Total Searches This Month:</strong>{" "}
              {totalSearchesThisMonth}
            </p>
            <p>
              <strong>Average Searches per Agent:</strong>{" "}
              {(totalSearchesThisMonth > 0 &&
                agents.length > 0 &&
                calculateAverage(totalSearchesThisMonth, agents.length)) ||
                0}
            </p>
            <p>
              <strong>Top Performer:</strong> Linda Smith (200 searches)
            </p>
          </div>

          <div className="widget">
            <h4>In Progress Searches</h4>
            <p>
              <strong>Total Pending Searches:</strong> 5
            </p>
            <p></p>
          </div>
        </div>

        <div className="card">
          <h3>Broker Roster</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Searches This Month</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents?.map((elem) => (
                <>
                  <tr id="broker-row-1">
                    <td>{elem.agentName}</td>
                    <td>
                      <span className="status active">{elem.status}</span>
                    </td>
                    <td>{elem.totalSearches}</td>
                    <td>
                      <div className="dropdown">
                        <button className="btn action-btn">
                          Actions <i className="fas fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                          <span onClick={() => unAssignAgent(elem.id)}>
                            Unassign
                          </span>
                          <span
                            onClick={() => inActiveAgentStatus(elem.agentId)}
                          >
                            Delete
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssginedAgents;
