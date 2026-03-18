import Billing from "@/components/common/billing";
import ProfileSetting from "@/components/common/profile-setting";
import { useState } from "react";
import AdvancedSettings from "../common/AdvancedSettings";

const agentTypes = [
  {
    name: "Profile Settings",
    id: "profile",
  },
  {
    name: "Billing",
    id: "billing",
  },
  // {
  //   name: "Advanced Settings",
  //   id: "advanced",
  // },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState(agentTypes[0]);
  const [editProfile, setIsProfile] = useState(false);

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      {editProfile !== true && (
        <div className="space-x-3 mb-4">
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
        </div>
      )}

      {activeTab.id === "profile" && (
        <ProfileSetting setIsProfile={setIsProfile} editProfile={editProfile} />
      )}
      {activeTab.id === "billing" && <Billing />}
      {/* {activeTab.id === "advanced" && <AdvancedSettings  />} */}
    </div>
  );
}
