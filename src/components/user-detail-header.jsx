import { PencilLine, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { SelectSeparator } from "./ui/select";

export default function UserDetailHeader() {
    return (
    <div className="bg-[#F5F0EC] rounded-lg py-5 px-7 my-4 text-secondary flex justify-between items-center ">
        <div className="flex items-center gap-4">
          <img
            src="/agent-2.png"
            alt="User"
            className="size-22 rounded-full object-cover"
          />
          <div>
            <p className="text-[#2A1A14] font-semibold text-2xl">
              James Anderson
            </p>
            <p className="text-tertiary text-sm">andrew@email.com</p>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="w-2 h-2 bg-[#1E8221] rounded-full"></span>
              <span className="text-[#1E8221]">Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4  flex-[0_0_50%]">

          <div className="flex gap-5 2xl:gap-10 w-full" >
            <Separator orientation="vertical" className=" !h-14 text-[#F4ECE6]" />
            <div className="w-full xl:whitespace-nowrap" >
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Account Created</p>
              <p className="font-semibold mt-1 2xl:text-2xl">Jan 02, 2024</p>
            </div>
            <Separator orientation="vertical" className="!h-14 text-[#F4ECE6]" />
            <div className="w-full  xl:whitespace-nowrap" >
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Last Activity</p>
              <p className="font-semibold mt-1 2xl:text-2xl">Oct 8, 2025</p>
            </div>
          </div>

          <div className="border border-[#E3D8D2] rounded-md p-4 max-w-[9rem] min-w-[8rem] w-full text-center xl:whitespace-nowrap">
            <p className="text-[#6B5E55]">Search Count</p>
            <p className="font-semibold text-2xl text-[#2A1A14]">27</p>
          </div>

          <div className="border border-[#E3D8D2] rounded-md p-4 max-w-[9rem] min-w-[8rem] w-full text-center bg-white xl:whitespace-nowrap">
            <p className="text-[#6B5E55] ">Business</p>
            <p className="font-semibold text-2xl text-[#2A1A14]">$60</p>
          </div>

          {/* <div className="flex gap-8 ml-2">
            <button className="text-[#6B5E55] hover:text-[#550000] cursor-pointer">
              <PencilLine size={18} />
            </button>
            <button className="text-[#6B5E55] hover:text-[#550000] cursor-pointer">
              <Trash2 size={18} />
            </button>
          </div> */}
        </div>
      </div>
    )
}