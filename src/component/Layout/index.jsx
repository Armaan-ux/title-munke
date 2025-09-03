import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../Sidebar/index";
import { SidebarProvider } from "@/components/ui/sidebar"
import AppHeader from "./app-header";


function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-4 min-w-0" >
        <AppHeader />
          <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default Layout;

// 2868 Reading rd
// 1210 S 24th St
// 782 Benner Rd