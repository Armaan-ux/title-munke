import React, { useState } from "react";
import { getFormattedDateTime } from "../../utils";
import "./AgentList.css";
import { reinviteAgent } from "../service/agent";

const AgentList = ({ setIsOpen, data, isAgentListLoading, refetchAgentList }) => {
  const [reinvitingAgentId, setReinvitingAgentId] = useState(null);

  const handleReinvite = async (agent) => {
    setReinvitingAgentId(agent.id);
    await reinviteAgent(agent);
    refetchAgentList();
    setReinvitingAgentId(null);
  };

  return (
    <div>
      <button className="open-modal-btn" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <div className="agent-list-modal">
        <div className="agent-list-modal-content">
          <div className="modal-header">
            <h2>Agents</h2>
            <span className="close" onClick={() => setIsOpen(false)}>
              &times;
            </span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  {/* <th>Email</th> */}
                  <th>last Login</th>
                  <th>Total Searches This Month</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isAgentListLoading ? (
                  <p>Loading Agents....</p>
                ) : data?.length ? (
                  data?.map((row) => (
                    <tr key={row.id}>
                      <td>{row.agentName}</td>
                      <td>
                        {row.lastLogin
                          ? getFormattedDateTime(row.lastLogin)
                          : ""}
                      </td>
                      <td>{row.totalSearches}</td>
                      <td>{row.status}</td>
                      <td>
                        <button
                          className={`reinvite-btn ${
                            reinvitingAgentId === row.id ? "reinviting" : ""
                          }`}
                          disabled={
                            row.status !== "UNCONFIRMED" || reinvitingAgentId
                          }
                          onClick={() => handleReinvite(row)}
                        >
                          {reinvitingAgentId === row.id
                            ? "Sending..."
                            : "Reinvite"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p>No records found!</p>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentList;
