import { useState } from "react";
import { cn } from "@/lib/utils";

export default function TimeFilter() {
  const [active, setActive] = useState("all");

  const buttons = [
    { key: "all", label: "All Time" },
    { key: "month", label: "This Month" },
    { key: "week", label: "This Week" },
  ];

  return (
    <div className="flex gap-2">
      {buttons.map((btn) => (
        <button
          key={btn.key}
          onClick={() => setActive(btn.key)}
          className={cn(
            "px-4 py-2 rounded-md border transition-all text-sm font-medium",
            active === btn.key
              ? "bg-[#550000] text-white border-[#550000]" 
              : "bg-white text-[#6B5E55] border-[#E3D8D2] hover:bg-[#F5F0EC]"
          )}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
