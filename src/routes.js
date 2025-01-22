import Admin from "./component/Admin";
import Agent from "./component/Agent";
import History from "./component/Agent/History";
import Setting from "./component/Agent/Setting";
import Broker from "./component/Broker";
import Search from "./component/Search";

export const adminRoutes = [{ path: "admin", component: Admin }];

export const agentRoutes = [
  { path: "agent", component: Agent },
  { path: "agent/search", component: Search },
  { path: "agent/history", component: History },
  { path: "agent/setting", component: Setting },
];

export const brokerRoutes = [{ path: "broker", component: Broker }];
