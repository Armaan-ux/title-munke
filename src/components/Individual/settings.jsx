import { useState } from "react";
import ProfileSetting from "../common/profile-setting";
import Notification from "../common/notification-setting";
import IndividualBilling from "./individual-billing";

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
];

export default function IndividualSettings() {
  const [activeTab, setActiveTab] = useState(agentTypes[0]);
 const [editProfile, setIsProfile] = useState(false);

  return (
    <div className="bg-[#F5F0EC] h-[90vh] rounded-lg p-7 mt-3 text-secondary">
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
      {activeTab.id === "notifications" && <Notification />}
      {activeTab.id === "billing" && <IndividualBilling />}
    </div>
  );
}

// export function  IndividualSettings() {
//   return <Setting />;
// }
