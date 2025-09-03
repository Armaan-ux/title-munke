import { useUser } from "../../context/usercontext";
import { routes } from "../../sidebarRoutes";
import { NavLink, useLocation } from "react-router-dom";
// import logo from "../../img/Logo.svg";
// import "./index.css";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

function AppSidebar() {
  const { user, signOut } = useUser();

  const location = useLocation()

  const userGroups =
    user?.signInUserSession?.idToken?.payload["cognito:groups"];
  const userRole = userGroups?.[0];

  const roleRoutes = routes[userRole] || [];

  return (


      <Sidebar className="" variant="floating" collapsible="icon" >
        
      {/* Header */}
      <SidebarHeader>
        <div>
            <img src="/Logo.svg" className="w-28 mx-auto" alt="Title Munke Logo" />
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu >
              {
                roleRoutes.map((item) => (
                   <SidebarMenuItem key={item.link} >
                    <SidebarMenuButton asChild  className="text-secondary h-12" isActive={location.pathname.startsWith(item.link)} >
                      <NavLink 
                        to={item.link} 
                        className={cn("!text-base", ({isActive}) => (isActive ? "bg-secondary" : ""))}  
                        // className={({ isActive }) => (isActive ? "active" : "")}
                      >
                        <item.icon className="mr-2" />
                         {/* <i style={{ marginRight: "4px" }} className={item.class}></i> */}
                        <span>{item.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>



          <SidebarMenu>
            <SidebarMenuItem>
             <SidebarMenuButton onClick={signOut} className="h-12 w-full group/btn flex justify-between items-center gap-2 p-3 px-5 h-14 bg-white text-secondary rounded-full text-sm hover:bg-[#e7dcd3] hover:shadow-sm transition-all cursor-pointer" >
                {/* <button  className="" >
                </button> */}
                  <span className="inline-flex gap-4 items-center" >
                  <LogOut size={16} />
                    Logout
                  </span>
                  <span >
                    <ChevronRight className="mr-2 group-hover/btn:mr-0 transition-all -z-10" size={16} />
                  </span>
             </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

      </SidebarFooter>

    </Sidebar>





    // <div className="sidebar">
    //   <div
    //     style={{
    //       background: "#ffffff",
    //       height: "285px",
    //       padding: "0",
    //       width: "288px",
    //       position: "fixed",
    //       top: "0",
    //       left: "0",
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItems: "center",
    //     }}
    //   >
    //     <span>
    //       <img src={logo} className="logoimg" alt="logo" />
    //     </span>
    //     {/* <h2 className="logo">Title Munke </h2> */}
    //   </div>
    //   <nav className="nav-links" style={{ position: "absolute", top: "300px" }}>
    //     {roleRoutes.map((route, index) => (
    //       <NavLink
    //         key={index}
    //         to={route.link}
    //         className={({ isActive }) => (isActive ? "active" : "")}
    //       >
    //         <i style={{ marginRight: "4px" }} className={route.class}></i>
    //         {route.name}
    //       </NavLink>
    //     ))}
    //   </nav>
    //   <button className="logout" onClick={signOut}>
    //     <i className="fas fa-right-from-bracket"></i>Logout
    //   </button>
    // </div>
  );
}

export default AppSidebar;
