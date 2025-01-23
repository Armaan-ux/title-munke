import { useEffect } from "react";
import { getTotalSearchesThisMonth } from "./service";

const AssginedAgents = () => {
  useEffect(() => {
    getTotalSearchesThisMonth();
  }, []);
  return (
    <>
      <div className="main-content">
        <div
          className="page-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ marginLeft: "20px" }}>Agent Dashboard</h1>
        </div>

        <div className="widgets">
          <div className="widget">
            <h4>Team Performance Overview</h4>
            <p>
              <strong>Total Searches This Month:</strong> 650
            </p>
            <p>
              <strong>Average Searches per Agent:</strong> 162.5
            </p>
            <p>
              <strong>Top Performer:</strong> Linda Smith (200 searches)
            </p>
          </div>

          <div className="widget">
            <h4>Pending Tasks</h4>
            <p>
              <strong>Total Pending Reports:</strong> 5
            </p>
            <p>
              <strong>Recent Alerts:</strong> 2 flagged documents (e.g., missing
              liens).
            </p>
          </div>
        </div>

        <div className="card">
          <h3>Broker Roster</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Status</th>
                <th>Searches This Month</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr id="broker-row-1">
                <td>
                  <img
                    src="img/agent1.png'"
                    alt="Broker Photo"
                    className="profile-photo"
                  />
                </td>
                <td>Damon Parker</td>
                <td>
                  <span className="status active">ACTIVE</span>
                </td>
                <td>150</td>
                <td>
                  <div className="dropdown">
                    <button className="btn action-btn">
                      Actions <i className="fas fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                      <a href="#" onclick="editBroker(1)">
                        Edit
                      </a>
                      <a href="#" onclick="deleteBroker(1)">
                        Delete
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
              <tr id="broker-row-2">
                <td>
                  <img
                    src="img/agent1.png"
                    alt="Broker Photo"
                    className="profile-photo"
                  />
                </td>
                <td>Thomas Joe</td>
                <td>
                  <span className="status active">ACTIVE</span>
                </td>
                <td>120</td>
                <td>
                  <div className="dropdown">
                    <button className="btn action-btn">
                      Actions <i className="fas fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                      <a href="#" onclick="editBroker(2)">
                        Edit
                      </a>
                      <a href="#" onclick="deleteBroker(2)">
                        Delete
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
              <tr id="broker-row-3">
                <td>
                  <img
                    src="img/agent1.png"
                    alt="Broker Photo"
                    className="profile-photo"
                  />
                </td>
                <td>Linda Smith</td>
                <td>
                  <span className="status active">ACTIVE</span>
                </td>
                <td>200</td>
                <td>
                  <div className="dropdown">
                    <button className="btn action-btn">
                      Actions <i className="fas fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                      <a href="#" onclick="editBroker(3)">
                        Edit
                      </a>
                      <a href="#" onclick="deleteBroker(3)">
                        Delete
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
              <tr id="broker-row-4">
                <td>
                  <img
                    src="img/agent1.png"
                    alt="Broker Photo"
                    className="profile-photo"
                  />
                </td>
                <td>Sarah Johnson</td>
                <td>
                  <span className="status active">ACTIVE</span>
                </td>
                <td>180</td>
                <td>
                  <div className="dropdown">
                    <button className="btn action-btn">
                      Actions <i className="fas fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                      <a href="#" onclick="editBroker(4)">
                        Edit
                      </a>
                      <a href="#" onclick="deleteBroker(4)">
                        Delete
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssginedAgents;
