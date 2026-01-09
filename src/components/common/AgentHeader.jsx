
import { format } from "date-fns-tz";
import { Separator } from "../ui/separator";

export default function AgentDetailHeader({data}) {
  
    return (
    <div className="bg-[#F5F0EC] rounded-lg py-5 px-7 my-4 text-secondary flex justify-between items-center ">
        <div className="flex items-center gap-4">
          <img
            src={data?.signedUrl || "/dummy-profile.png"}
            alt="User"
            className="size-22 rounded-full object-cover"
          />
          <div>
            <p className="text-[#2A1A14] font-semibold text-2xl">
              {data?.name}
            </p>
            <p className="text-tertiary text-sm">{data?.email}</p>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className={`${
                  data?.status === "ACTIVE" ? "bg-[#1E8221]"
                    : (data?.status === "DELETED" ? " bg-destructive/80" : "bg-[#A2781E]") 
                } w-2 h-2 rounded-full`}></span>
              <span className={`${
                  data?.status === "ACTIVE" ? "bg-[#E9F3E9] text-[#1E8221]"
                    : (data?.status === "DELETED" ? " text-destructive/80 bg-destructive/20" : "bg-[#FFF3D9] text-[#A2781E]") 
                } text-[13px] font-medium px-3 py-1 rounded-full`}
                >
                  {data?.status}
                </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4  flex-[0_0_50%]">

          <div className="flex gap-5 2xl:gap-10 w-full" >
            <Separator orientation="vertical" className=" !h-14 text-[#F4ECE6]" />
            <div className="w-full xl:whitespace-nowrap" >
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Account Created</p>
              <p className="font-semibold mt-1 2xl:text-2xl">{format(data?.createdAt, "MMM dd, yyyy")}</p>
            </div>
            <Separator orientation="vertical" className="!h-14 text-[#F4ECE6]" />
            <div className="w-full  xl:whitespace-nowrap" >
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Last Activity</p>
              <p className="font-semibold mt-1 2xl:text-2xl">{format(data?.lastLogin, "MMM dd, yyyy")}</p>
            </div>
          </div>

          <div className="border border-[#E3D8D2] rounded-md p-4 max-w-[9rem] min-w-[8rem] w-full text-center xl:whitespace-nowrap">
            <p className="text-[#6B5E55]">Search Count</p>
            <p className="font-semibold text-2xl text-[#2A1A14]">{data?.totalSearches ?? data?.searchCount}</p>
          </div>

          {typeof data?.revenue === "number" &&
          <div className="border border-[#E3D8D2] rounded-md p-4 max-w-[9rem] min-w-[8rem] w-full text-center bg-white xl:whitespace-nowrap">
            <p className="text-[#6B5E55] ">Business</p>
            <p className="font-semibold text-2xl text-[#2A1A14]">${data?.revenue}</p>
          </div>
          }

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