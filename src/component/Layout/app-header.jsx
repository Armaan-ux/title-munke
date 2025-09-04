import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/context/usercontext";
import { routes } from "@/sidebarRoutes";
import { useLocation } from "react-router-dom";

export default function AppHeader() {
    const { user } = useUser();
  
    const location = useLocation()
  
    const userGroups =
      user?.signInUserSession?.idToken?.payload["cognito:groups"];
    const userRole = userGroups?.[0];
  
    const roleRoutes = routes[userRole] || [];
    const headerTitle = roleRoutes.find((item) => location.pathname.startsWith(item.link))?.name;
  return (
    <div className="border rounded-xl px-4 lg:px-6 py-3 bg-white flex justify-between gap-4 items-center w-full text-secondary">
        <div className="flex items-center gap-2" >
            <SidebarTrigger />
            <p>{headerTitle || ''}</p>
        </div>

        <div className="flex items-center gap-3">
            <img src="/dummy-profile.png" alt="profile" className="w-11" />
            <p>William Col</p>
        </div>
    </div>
  );
}