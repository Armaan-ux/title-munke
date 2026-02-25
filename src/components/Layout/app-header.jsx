import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/context/usercontext";
import { routes } from "@/sidebarRoutes";
import { queryKeys } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { ShieldUser } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getAdminDetails } from "../service/userAdmin";
import { useUserIdType } from "@/hooks/useUserIdType";

export default function AppHeader() {
  const { user } = useUser();

  const location = useLocation();
  const { userId } = useUserIdType();

  const userGroups =
    user?.signInUserSession?.idToken?.payload["cognito:groups"];
  const userRole = userGroups?.[0];

  const roleRoutes = routes[userRole] || [];
  const headerTitle = roleRoutes.find((item) =>
    location.pathname.startsWith(item.link),
  )?.name;

  const getUserDetail = useQuery({
    queryKey: [queryKeys.getUserDetails, userId],
    queryFn: () => getAdminDetails(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // prevent refetch for 1 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <div className="border rounded-xl px-4 lg:px-6 py-3 bg-white flex justify-between gap-4 items-center w-full text-secondary">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <p>{headerTitle || ""}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* <img src="/dummy-profile.png" alt="profile" className="w-11" /> */}
        {/* <ShieldUser /> */}
        <img
          src={getUserDetail?.data?.profileImageUrl || "/dummy-profile.png"}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p>{getUserDetail?.data?.attributes?.name || ""}</p>
      </div>
    </div>
  );
}
