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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight, LogOut } from "lucide-react";

function AppSidebar() {
  const { state } = useSidebar();
  const { user, signOut, setMemberModal } = useUser();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const userGroups =
    user?.signInUserSession?.idToken?.payload["cognito:groups"];

  const userRole = userGroups?.[0];
  const roleRoutes = routes[userRole] || [];

  const memberHandler = () => {
    setMemberModal(true);
  };

  return (
    <Sidebar className="" variant="floating" collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <div>
          <img
            src="/Logo.svg"
            className="w-28 mx-auto"
            alt="Title Munke Logo"
          />
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {roleRoutes.map((item) => (
                <SidebarMenuItem key={item.link}>
                  <SidebarMenuButton
                    asChild
                    className="text-secondary h-12"
                    isActive={location.pathname.startsWith(item.link)}
                  >
                    <NavLink
                      to={item.link}
                      className={cn("!text-base", ({ isActive }) =>
                        isActive ? "bg-secondary" : ""
                      )}
                      // className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <item.icon className="mr-2" />
                      {/* <i style={{ marginRight: "4px" }} className={item.class}></i> */}
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className=" w-full group/btn flex justify-between items-center gap-2 p-3 px-5 h-14 bg-white text-secondary rounded-full text-sm hover:bg-[#e7dcd3] hover:shadow-sm transition-all cursor-pointer"
            >
              <span className="inline-flex text-base gap-4 items-center">
                {/* <LogOut size={16} /> */}
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4987 3.1145C11.8956 3.1145 12.2174 3.4363 12.2174 3.83325C12.2174 4.2302 11.8956 4.552 11.4987 4.552C7.66147 4.552 4.55078 7.66269 4.55078 11.4999C4.55078 15.3372 7.66147 18.4478 11.4987 18.4478C11.8956 18.4478 12.2174 18.7696 12.2174 19.1666C12.2174 19.5635 11.8956 19.8853 11.4987 19.8853C6.86756 19.8853 3.11328 16.1311 3.11328 11.4999C3.11328 6.86878 6.86756 3.1145 11.4987 3.1145Z" fill="#3D2014"/>
                  <path d="M15.7822 9.13323C15.5015 8.85254 15.5015 8.39745 15.7822 8.11676C16.0629 7.83608 16.5179 7.83608 16.7986 8.11676L19.6736 10.9918C19.9543 11.2725 19.9543 11.7275 19.6736 12.0082L16.7986 14.8832C16.5179 15.1639 16.0629 15.1639 15.7822 14.8832C15.5015 14.6025 15.5015 14.1475 15.7822 13.8668L17.4301 12.2187H9.58203C9.18508 12.2187 8.86328 11.8969 8.86328 11.5C8.86328 11.1031 9.18508 10.7812 9.58203 10.7812H17.4301L15.7822 9.13323Z" fill="#3D2014"/>
                  </svg>

                Logout
              </span>
              <span>
                <ChevronRight
                  className="mr-2 group-hover/btn:mr-0 transition-all -z-10"
                  size={20}
                />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* { (userRole === "broker" && user?.status !== "active" && user.hasOwnProperty("status")) &&
            <div className="bg-gradient-to-b  from-secondary to-tertiary py-2 flex flex-col items-center justify-center text-white rounded-2xl mt-2">
              <img src="/diamond.png" alt="diamond" />
              {!isCollapsed && (
                <div className="flex flex-col items-center justify-center transition-all duration-300">
                  <div className="text-lg font-semibold mb-1 whitespace-nowrap">
                    Become a Member
                  </div>
                  <button
                    onClick={memberHandler}
                    className="text-sm text-center font-semibold rounded-lg border-white bg-secondary-foreground text-tertiary px-5 py-2"
                  >
                    Subscribe Now
                  </button>
                </div>
              )}
            </div>
          } */}
          
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
