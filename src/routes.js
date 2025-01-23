import Admin from "./component/Admin";
import Agent from "./component/Agent";
import AgentHistory from "./component/Agent/History";
import AgentSetting from "./component/Agent/Setting";
import BrokerHistory from "./component/Broker/History";
import BrokerSetting from "./component/Broker/Setting";
import Broker from "./component/Broker";
import Search from "./component/Search";
import AssginedAgents from "./component/Broker/AssingedAgent";

export const adminRoutes = [{ path: "admin", component: Admin }];

export const agentRoutes = [
  { path: "agent", component: Agent },
  { path: "agent/search", component: Search },
  { path: "agent/history", component: AgentHistory },
  { path: "agent/setting", component: AgentSetting },
];

export const brokerRoutes = [
  { path: "broker", component: Broker },
  { path: "broker/search", component: Search },
  { path: "broker/history", component: BrokerHistory },
  { path: "broker/setting", component: BrokerSetting },
  { path: "broker/manage-agents", component: AssginedAgents },
];
