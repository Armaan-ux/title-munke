import { BookUser, LayoutDashboard, Logs, Settings, UserRound } from "lucide-react";

export const routes = {
  agent: [
    // {
    //   link: "/agent/search",
    //   name: "Search",
    //   class: "fas fa-search",
    // },

    // {
    //   link: "/agent/history",
    //   name: "View Search History",
    //   class: "fas fa-history",
    // },
    // {
    //   link: "/agent/setting",
    //   name: "Setting",
    //   class: "fas fa-cog",
    // },
    {
      link: "/agent/dashboard",
      name: "Dashboard",
      class: "fas fa-search",
      icon: LayoutDashboard
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
    // {
    //   link: "/admin/dashboard",
    //   name: "Dashboard",
    //   class: "fas fa-person",
    //   icon: LayoutDashboard
    // },
    {
      link: "/admin/users",
      name: "Users",
      class: "fas fa-person",
      icon: UserRound
    },
    {
      link: "/admin/demo-requests",
      name: "Demo Requests",
      class: "fas fa-person",
      icon: BookUser
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
    // {
    //   link: "/admin/manage-admins",
    //   name: "Manage Admins",
    //   class: "fas fa-person",
    // },
    // {
    //   link: "/admin/brokers",
    //   name: "Admin Broker List",
    //   class: "fas fa-history",
    // },
    // {
    //   link: "/admin/searchHistory",
    //   name: "All Search History",
    //   class: "fas fa-search",
    // },
    // {
    //   link: "/admin/setting",
    //   name: "Setting",
    //   class: "fas fa-cog",
    // },
    // {
    //   link: "/admin/audit-log",
    //   name: "Audit Logs",
    //   class: "fas fa-clipboard-list",
    // },
  ],
  broker: [
    {
      // link: "/broker/search",
      link: "/broker/dashboard",
      name: "Dashboard",
      class: "fas fa-search",
      icon: LayoutDashboard
    },

    // {
    //   link: "/broker/history",
    //   name: "View Search History",
    //   class: "fas fa-history",
    // },

    {
      link: "/broker/manage-agents",
      name: "Agents",
      class: "fas fa-person",
      icon: UserRound
    },
    // {
    //   link: "/broker/manage-not-assigned-agents",
    //   name: "Not Assigned Agents",
    //   class: "fas fa-users",
    // },
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
};
