import { useState, useEffect } from "react";
import Setting from "@/components/common/settings";
import ProfileSetting from "@/components/common/profile-setting";
import Notification from "@/components/common/notification-setting";
import Billing from "@/components/common/billing";
import AdvancedSettings from "../common/AdvancedSettings";

const agentTypes = [
  {
    name: "Profile Settings",
    id: "profile",
  },
  {
    name: "Notifications",
    id: "notifications",
  },
  {
    name: "Billing",
    id: "billing",
  },
  //  {
  //   name: "Advanced Settings",
  //   id: "advanced",
  // },
];

export default function ManageAgents() {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTabId = localStorage.getItem("brokerSettingsActiveTab");
    return agentTypes.find((tab) => tab.id === savedTabId) || agentTypes[0];
  });

  useEffect(() => {
    localStorage.setItem("brokerSettingsActiveTab", activeTab.id);
  }, [activeTab]);
  const [editProfile, setIsProfile] = useState(false);

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-4 px-7  my-4 text-secondary">
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
      {activeTab.id === "notifications" && <Notification />}
      {activeTab.id === "billing" && <Billing />}
      {/* {activeTab.id === "advanced" && <AdvancedSettings userType="broker" />} */}
    </div>
  );
}

export function BrokerSettings() {
  return <Setting />;
}
