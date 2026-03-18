import { useEffect, useState } from "react";
import ProfileSetting from "@/components/common/profile-setting";
import OtherSetting from "@/components/common/other-setting";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import { getAiModels, getDefaultAiModel } from "../service/chat";
import { useUserIdType } from "@/hooks/useUserIdType";
import ProductList from "./Setting/Pricing/productList";

const agentTypes = [
  {
    name: "Profile Settings",
    id: "profile",
  },
  {
    name: " AI Governance",
    id: "others",
  },
  {
    name: "Upgrade Price",
    id: "price",
  },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTabId = localStorage.getItem("adminSettingsActiveTab");
    return agentTypes.find((tab) => tab.id === savedTabId) || agentTypes[0];
  });

  useEffect(() => {
    localStorage.setItem("adminSettingsActiveTab", activeTab.id);
  }, [activeTab]);
 const [editProfile, setIsProfile] = useState(false);
 const {userId, userType} = useUserIdType();
 const aiModelQuery = useQuery({
    queryKey: [queryKeys.aiModelListing],
    queryFn: () => getAiModels({action: "get_llm_list", user_id: userId, userType}),
 })

const defualtAiModelQuery = useQuery({
    queryKey: [queryKeys.defaultAiModel],
    queryFn: () => getDefaultAiModel({
    action: "get_llm_by_admin",
    admin_id: userId,
    userType
  })
  })
  console.log("defualtAiModelQuery", defualtAiModelQuery?.data?.[0]?.data?.llm_name);

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      {editProfile !== true && <div className="space-x-3 mb-4">
        {agentTypes.map((item, index) => (
          <button
            className={` ${
              activeTab.id === item.id
                ? "bg-tertiary text-white"
                : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
            } transition-all  rounded-full px-10 py-3 `}
            onClick={() => setActiveTab(item)}
          >
            {item.name}
          </button>
        ))}
      </div>}

      {activeTab.id === "profile" && <ProfileSetting setIsProfile={setIsProfile}  editProfile={editProfile} />}
      {activeTab.id === "others" && <OtherSetting aiModels={aiModelQuery.data?.data || [] } selectedModel={defualtAiModelQuery?.data?.[0]?.data?.llm_name} />}
      {activeTab.id === "price" && <ProductList />}
    </div>
  );
}
