import Admin from "./components/Admin";
import Agent from "./components/Agent";
import AgentSetting from "./components/Agent/settings";
import Broker from "./components/Broker";
import AdminSettings from "./components/Admin/admin-settings";
import AdminAuditLogs from "./components/Admin/audit-logs";
import AuditLogs from "./components/Agent/audit-logs";
import BrokerSettings from "./components/Broker/settings";
import BrokerDashboard from "./components/Broker/dashboard";
import AgentDashboard from "./components/Agent/dashboard";
import ManageAgents from "./components/Broker/manage-agents";


import AuditLogsForBroker from "./components/Broker/audit-logs";
import DemoRequests from "./components/Admin/demo-requests";
import Users from "./components/Admin/users";

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
