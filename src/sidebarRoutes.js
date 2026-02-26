import { BookUser, LayoutDashboard, Logs, Settings, UserRound,UserRoundCog } from "lucide-react";

export const routes = {
  agent: [
    {
      link: "/agent/dashboard",
      name: "Dashboard",
      class: "fas fa-search",
      icon: LayoutDashboard
    },
       {
      link: "/agent/request",
      name: "Request",
      class: "fas fa-search",
      icon: UserRoundCog
    },

    {
      link: "/agent/audit-logs",
      name: "Audit Logs",
      class: "fas fa-history",
      icon: Logs
    },
    {
      link: "/agent/setting",
      name: "Settings",
      class: "fas fa-cog",
      icon: Settings
    },
  ],
  admin: [
    {
      link: "/admin/dashboard",
      name: "Dashboard",
      class: "fas fa-person",
      icon: LayoutDashboard
    },
    {
      link: "/admin/demo-requests",
      name: "Demo Requests",
      class: "fas fa-person",
      icon: BookUser
    },
    {
      link: "/admin/users",
      name: "Users",
      class: "fas fa-person",
      icon: UserRound
    },
    {
      link: "/admin/audit-logs",
      name: "Audit Logs",
      class: "fas fa-person",
      icon: Logs
    },
    {
      link: "/admin/settings",
      name: "Settings",
      class: "fas fa-person",
      icon: Settings
    },

  ],
   organisation: [
    {
      link: "/organisation/dashboard",
      name: "Dashboard",
      class: "fas fa-person",
      icon: LayoutDashboard
    },
    {
      link: "/organisation/demo-requests",
      name: "Demo Requests",
      class: "fas fa-person",
      icon: BookUser
    },
    {
      link: "/organisation/users",
      name: "Users",
      class: "fas fa-person",
      icon: UserRound
    },
    {
      link: "/organisation/audit-logs",
      name: "Audit Logs",
      class: "fas fa-person",
      icon: Logs
    },
    {
      link: "/organisation/settings",
      name: "Settings",
      class: "fas fa-person",
      icon: Settings
    },

  ],
  broker: [
    {
      link: "/broker/dashboard",
      name: "Dashboard",
      class: "fas fa-search",
      icon: LayoutDashboard
    },
      {
      link: "/broker/request",
      name: "Request",
      class: "fas fa-search",
      icon: UserRoundCog
    },
    {
      link: "/broker/manage-agents",
      name: "Agents",
      class: "fas fa-person",
      icon: UserRound
    },
    {
      link: "/broker/agent-audit-log",
      name: "Audit Logs",
      class: "fas fa-clipboard-list",
      icon: Logs
    },
    {
      link: "/broker/setting",
      name: "Settings",
      class: "fas fa-cog",
      icon: Settings
    },
  ],
  individual: [
    {
      link: "/individual/dashboard",
      name: "Dashboard",
      class: "fas fa-search",
      icon: LayoutDashboard
    },
    {
      link: "/individual/agent-audit-log",
      name: "Audit Logs",
      class: "fas fa-clipboard-list",
      icon: Logs
    },
    {
      link: "/individual/setting",
      name: "Settings",
      class: "fas fa-cog",
      icon: Settings
    },
  ],
};
