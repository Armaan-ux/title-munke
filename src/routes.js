import Admin from "./component/Admin";
import Agent from "./component/Agent";
import Broker from "./component/Broker";
import Search from "./component/Search";

export const adminRoutes = [{ path: "admin", component: Admin }];

export const agentRoutes = [
  { path: "agent", component: Agent },
  { path: "agent/search", component: Search },
];

export const brokerRoutes = [{ path: "broker", component: Broker }];
