import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../Sidebar/index";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "./app-header";
import AIChatBot from "../common/AIChatBot";
import MembershipOrCardAddedModalContainer from "../common/MembershipOrCardAddedModalContainer";
import { useUserIdType } from "@/hooks/useUserIdType";

function Layout() {
  const {userType} = useUserIdType();
  return (
    <>
      <MembershipOrCardAddedModalContainer />
      <SidebarProvider className="overflow-x-hidden">
        <AppSidebar />
        <main className="flex-1 md:pl-0 p-4 min-w-0">
          <AppHeader />
          {userType !== "admin" && <AIChatBot />}
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}

export default Layout;

// 2868 Reading rd
// 1210 S 24th St
// 782 Benner Rd
