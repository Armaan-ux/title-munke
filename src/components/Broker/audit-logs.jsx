import React, { useState } from "react";
import AuditLogsForBroker from "./audit-logs-broker";
import AuditLogsForAgents from "./audit-logs-agent";

const AuditLogs = () => {
  const agentTypes = [
    {
      name: "Brokers",
      id: "brokers",
    },
    {
      name: "Agents",
      id: "agents",
    },
  ];

  const [activeTab, setActiveTab] = useState(agentTypes[0]);
  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      <div className="space-x-3 mb-4">
        {agentTypes.map((item, index) => (
          <button
            key={item.id}
            className={` ${activeTab.id === item.id
                ? "bg-tertiary text-white"
                : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
              } transition-all  rounded-full px-10 py-3 `}
            onClick={() => setActiveTab(item)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div >
        {activeTab.id === "brokers" && <AuditLogsForBroker />}
        {activeTab.id === "agents" && <AuditLogsForAgents />}
      </div>
    </div>
  );
};

export default AuditLogs;
