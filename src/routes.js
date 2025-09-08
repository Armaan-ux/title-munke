import Admin from "./component/Admin";
import Agent from "./component/Agent";
// import AgentHistory from "./component/Agent/History";
import AgentSetting from "./component/Agent/settings";
// import BrokerHistory from "./component/Broker/History";
// import BrokerSetting from "./component/Broker/Setting";
import Broker from "./component/Broker";
// import Search from "./component/Search";
// import AssignedAgents from "./component/Broker/AssingedAgent";
import BorkerList from "./component/Admin/BrokerList";
import AllSearchHistory from "./component/Admin/History";
import AdminSettings from "./component/Admin/admin-settings";
import ManageAdmins from "./component/Admin/ManageAdmins";
// import NotAssignedAgents from "./component/Broker/NotAssignedAgents";
// import AgentAuditLogs from "./component/Broker/AuditLogs";
import AdminAuditLogs from "./component/Admin/audit-logs";
// import Dashboard from "./component/Agent/dashboard";
import AuditLogs from "./component/Agent/audit-logs";
import BrokerSettings from "./component/Broker/settings";
import BrokerDashboard from "./component/Broker/dashboard";
import AgentDashboard from "./component/Agent/dashboard";
import ManageAgents from "./component/Broker/manage-agents";


import AuditLogsForBroker from "./component/Broker/audit-logs";
import AdminDashboard from "./component/Admin/dashboard";
import DemoRequests from "./component/Admin/demo-requests";
import Users from "./component/Admin/users";

export const adminRoutes = [
  { path: "admin", component: Admin },
  // { path: "admin/dashboard", component: AdminDashboard },
  { path: "admin/users", component: Users },
  { path: "admin/demo-requests", component: DemoRequests },
  { path: "admin/audit-logs", component: AdminAuditLogs },
  { path: "admin/settings", component: AdminSettings },
  // { path: "admin/brokers", component: BorkerList },
  // { path: "admin/searchHistory", component: AllSearchHistory },
  // { path: "admin/setting", component: AdminSettings },
  // { path: "admin/manage-admins", component: ManageAdmins },
  // { path: "admin/audit-log", component: AdminAuditLogs },
];

export const agentRoutes = [
  { path: "agent", component: Agent },
  { path: "agent/dashboard", component: AgentDashboard },
  { path: "agent/audit-logs", component: AuditLogs },
  { path: "agent/setting", component: AgentSetting },
];

export const brokerRoutes = [
  { path: "broker", component: Broker },
  { path: "broker/dashboard", component: BrokerDashboard },
  { path: "broker/manage-agents", component: ManageAgents },
  { path: "broker/agent-audit-log", component: AuditLogsForBroker },
  { path: "broker/setting", component: BrokerSettings },

  // { path: "broker/search", component: Search },
  // { path: "broker/history", component: BrokerHistory },
  // { path: "broker/setting", component: BrokerSetting },
  // { path: "broker/manage-agents", component: AssignedAgents },
  // { path: "broker/manage-not-assigned-agents", component: NotAssignedAgents },
  // { path: "broker/agent-audit-log", component: AgentAuditLogs },
];
