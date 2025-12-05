import { CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DateFilter({handleFilter}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="flex gap-2 items-center">
      <div className="relative w-[160px]">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border border-[#E3D8D2] rounded-md px-3 py-2.5 pr-8 text-[#6B5E55] text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#550000] appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          placeholder="dd-mm-yyyy"
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E55] pointer-events-none" />
      </div>

      <div className="relative w-[160px]">
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border border-[#E3D8D2] rounded-md px-3 py-2.5 pr-8 text-[#6B5E55] text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#550000] appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          placeholder="dd-mm-yyyy"
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E55] pointer-events-none" />
      </div>

      <Button 
        className="bg-[#550000] hover:bg-[#3D0000] text-white text-sm px-5 rounded-md flex items-center gap-2"
        onClick={() => {
          if(startDate && endDate)
            handleFilter?.(new Date(new Date(startDate)?.setHours(0, 0, 0, 0))?.toISOString(), new Date(new Date(endDate)?.setHours(23, 59, 59, 999))?.toISOString())}
        }
      >
        APPLY
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
}
