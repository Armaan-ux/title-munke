
import { format } from "date-fns-tz";
import { useParams } from "react-router-dom";
import { CenterLoader } from "./Loader";
import { queryKeys } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import ShowError from "./ShowError";
import { Separator } from "../ui/separator";
import { getAgentDetails } from "../service/userAdmin";

export default function AgentDetailHeader() {
  const {id} = useParams();
  const agentMetricsAdminQeurry = useQuery({
    queryKey: [queryKeys.agentMetricsAdmin, id],
    queryFn: () => getAgentDetails(id),
    enabled: !!id
  })

  if(agentMetricsAdminQeurry?.isLoading) return <div className="h-auto"><CenterLoader /></div>
  if(agentMetricsAdminQeurry?.isError) return <ShowError message={agentMetricsAdminQeurry?.error?.response?.data?.message} />;

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
              {agentMetricsAdminQeurry?.data?.name}
            </p>
            <p className="text-tertiary text-sm">{agentMetricsAdminQeurry?.data?.email}</p>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="w-2 h-2 bg-[#1E8221] rounded-full"></span>
              <span className="text-[#1E8221]">{agentMetricsAdminQeurry?.data?.status}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4  flex-[0_0_50%]">

          <div className="flex gap-5 2xl:gap-10 w-full" >
            <Separator orientation="vertical" className=" !h-14 text-[#F4ECE6]" />
            <div className="w-full xl:whitespace-nowrap" >
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Account Created</p>
              <p className="font-semibold mt-1 2xl:text-2xl">{format(agentMetricsAdminQeurry?.data?.createdAt, "MMM dd, yyyy")}</p>
            </div>
            <Separator orientation="vertical" className="!h-14 text-[#F4ECE6]" />
            <div className="w-full  xl:whitespace-nowrap" >
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Last Activity</p>
              <p className="font-semibold mt-1 2xl:text-2xl">{format(agentMetricsAdminQeurry?.data?.lastLogin, "MMM dd, yyyy")}</p>
            </div>
          </div>

          <div className="border border-[#E3D8D2] rounded-md p-4 max-w-[9rem] min-w-[8rem] w-full text-center xl:whitespace-nowrap">
            <p className="text-[#6B5E55]">Search Count</p>
            <p className="font-semibold text-2xl text-[#2A1A14]">{agentMetricsAdminQeurry?.data?.totalSearches}</p>
          </div>

          {/* <div className="border border-[#E3D8D2] rounded-md p-4 max-w-[9rem] min-w-[8rem] w-full text-center bg-white xl:whitespace-nowrap">
            <p className="text-[#6B5E55] ">Business</p>
            <p className="font-semibold text-2xl text-[#2A1A14]">${agentMetricsAdminQeurry?.data?.revenue}</p>
          </div> */}

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