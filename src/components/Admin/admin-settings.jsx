import { useState } from "react";
import ProfileSetting from "@/components/common/profile-setting";
import OtherSetting from "@/components/common/other-setting";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import { getAiModels, getDefaultAiModel } from "../service/chat";

const agentTypes = [
  {
    name: "Profile Settings",
    id: "profile",
  },
  {
    name: " AI Governance",
    id: "others",
  },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState(agentTypes[0]);
 const [editProfile, setIsProfile] = useState(false);
//  const aiModelQuery = useQuery({
//     queryKey: [queryKeys.aiModelListing],
//     queryFn: getAiModels
//  })

// const defualtAiModelQuery = useQuery({
//     queryKey: [queryKeys.defaultAiModel],
//     queryFn: () => getDefaultAiModel()
//   })

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
      {activeTab.id === "others" && <OtherSetting />}
    </div>
  );
}
