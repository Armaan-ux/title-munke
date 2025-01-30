export const routes = {
  agent: [
    {
      link: "/agent/search",
      name: "Search",
      class: "fas fa-search",
    },

    {
      link: "/agent/history",
      name: "View Search History",
      class: "fas fa-history",
    },
    {
      link: "/agent/setting",
      name: "Setting",
      class: "fas fa-cog",
    },
  ],
  admin: [
    {
      link: "/admin/manage-admins",
      name: "Manage Admins",
      class: "fas fa-person",
    },
    {
      link: "/admin/brokers",
      name: "Admin Broker List",
      class: "fas fa-history",
    },
    {
      link: "/admin/searchHistory",
      name: "All Search History",
      class: "fas fa-search",
    },
    {
      link: "/admin/setting",
      name: "Setting",
      class: "fas fa-cog",
    },
  ],
  broker: [
    {
      link: "/broker/search",
      name: "Search",
      class: "fas fa-search",
    },

    {
      link: "/broker/history",
      name: "View Search History",
      class: "fas fa-history",
    },
    {
      link: "/broker/setting",
      name: "Setting",
      class: "fas fa-cog",
    },
    {
      link: "/broker/manage-agents",
      name: "Agents",
      class: "fas fa-person",
    },
    {
      link: "/broker/manage-not-assigned-agents",
      name: "Not Assigned Agents",
      class: "fas fa-users",
    },
  ],
};
