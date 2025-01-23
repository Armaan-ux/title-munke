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
      link: "/agent/search",
      name: "Admin",
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
  ],
};
