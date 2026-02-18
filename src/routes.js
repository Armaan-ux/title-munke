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
import HistoryListview from "./components/Broker/history-listview";
import AuditLogsForBroker from "./components/Broker/audit-logs";
import DemoRequests from "./components/Admin/demo-requests";
import Users from "./components/Admin/users";
import AgentPropertyDetails from "./components/Broker/agent-property-details";
import BillingHistory from "./components/common/billing-history";
import { EmailTemplate } from "./components/common/email-template";
import Individual from "./components/Individual";
import IndividualDashboard from "./components/Individual/dashboard";
import ProperySearchListView from "./components/Individual/propery-search";
import BrokerPropertyDetails from "./components/Broker/broker-property-details";
import IndividualPropertyDetails from "./components/Individual/individual-property-details";
import AuditLogsForIndividual from "./components/Individual/individual-audit-log";
import IndividualSettings from "./components/Individual/settings";
import AdminDashboard from "./components/Admin/dashboard";
import BrokerBusiness from "./components/Admin/broker-business";
import BrokerDetails from "./components/Admin/broker-details";
import PropertySearch from "./components/Admin/property-search";
import IndividualBusiness from "./components/Admin/individual-business";
import PropertySearchIndividual from "./components/Admin/property-search-individual";
import Request from "./components/Agent/request";
import RequestBroker from "./components/Broker/request-broker";

export const adminRoutes = [
  { path: "admin", component: Admin },
  { path: "admin/dashboard", component: AdminDashboard },
  { path: "admin/dashboard/broker-business", component: BrokerBusiness },
  { path: "admin/dashboard/individual-business", component: IndividualBusiness },
  { path: "admin/dashboard/broker-details/:id", component: BrokerDetails },
  { path: "admin/dashboard/property-search/:id", component: PropertySearch },
  { path: "admin/dashboard/property-search-individual/:id", component: PropertySearchIndividual },

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
  { path: "agent/dashboard/search-history", component: HistoryListview },
  { path: "agent/dashboard/property-details/:id", component: BrokerPropertyDetails },
  { path: "agent/audit-logs", component: AuditLogs },
  { path: "agent/request", component: Request },
  { path: "agent/setting", component: AgentSetting },
];

export const brokerRoutes = [
  { path: "broker", component: Broker },
  { path: "broker/dashboard", component: BrokerDashboard },
  { path: "broker/dashboard/search-history", component: HistoryListview },
  { path: "broker/dashboard/property-details/:id", component: BrokerPropertyDetails },
  { path: "broker/manage-agents", component: ManageAgents },
  { path: "broker/agent-audit-log", component: AuditLogsForBroker },
  { path: "broker/setting", component: BrokerSettings },
  { path: "/broker/request", component: RequestBroker },
  {
    path: "broker/manage-agents/agent-property-details/:id",
    component: PropertySearch,
  },
  { path: "broker/setting/billing-history", component: BillingHistory },
  { path: "broker/email-template", component: EmailTemplate },

  // { path: "broker/search", component: Search },
  // { path: "broker/history", component: BrokerHistory },
  // { path: "broker/setting", component: BrokerSetting },
  // { path: "broker/manage-agents", component: AssignedAgents },
  // { path: "broker/manage-not-assigned-agents", component: NotAssignedAgents },
  // { path: "broker/agent-audit-log", component: AgentAuditLogs },
];

export const individualRoutes = [
  { path: "individual", component: Individual },
  { path: "individual/dashboard", component: IndividualDashboard },
  { path: "individual/dashboard/search-history", component: HistoryListview },
  // { path: "individual/property-search", component: ProperySearchListView },
  {
    path: "individual/dashboard/property-details/:id",
    component: IndividualPropertyDetails,
  },
  { path: "individual/agent-audit-log", component: AuditLogsForIndividual },
  { path: "individual/setting", component: IndividualSettings },
  { path: "individual/setting/billing-history", component: BillingHistory },
  { path: "individual/email-template", component: EmailTemplate },
];
