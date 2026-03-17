import { PencilLine, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { SelectSeparator } from "./ui/select";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils";
import { getBrokerDetails, getOrganisationDetails } from "./service/userAdmin";
import { CenterLoader } from "./common/Loader";
import ShowError from "./common/ShowError";
import { format } from "date-fns-tz";

export default function OrgDetailHeader() {
  const {id} = useParams();
  const orgMetricsAdminQeurry = useQuery({
    queryKey: [queryKeys.brokerMetricsAdmin, id],
    queryFn: () => getOrganisationDetails(id),
    enabled: !!id
  })

  if(orgMetricsAdminQeurry?.isLoading) return <div className="h-auto"><CenterLoader /></div>
  if(orgMetricsAdminQeurry?.isError) return <ShowError message={orgMetricsAdminQeurry?.error?.response?.data?.message} />;

    return (
    <div className="bg-[#F5F0EC] rounded-lg py-5 px-7 my-4 text-secondary flex justify-between items-center ">
        <div className="flex items-center gap-4">
          <img
            src={orgMetricsAdminQeurry?.data?.signedUrl || "/dummy-profile.png"}
            alt="User"
            className="size-22 rounded-full object-cover"
          />
          <div>
            <p className="text-[#2A1A14] font-semibold text-2xl">
              {orgMetricsAdminQeurry?.data?.name}
            </p>
            <p className="text-tertiary text-sm">{orgMetricsAdminQeurry?.data?.email}</p>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className={`${
                  orgMetricsAdminQeurry?.data?.status === "ACTIVE" ? "bg-[#1E8221]"
                    : (orgMetricsAdminQeurry?.data?.status === "DELETED" ? " bg-destructive/80" : "bg-[#A2781E]") 
                } w-2 h-2 rounded-full`}></span>
              <span className={`${
                  orgMetricsAdminQeurry?.data?.status === "ACTIVE" ? "bg-[#E9F3E9] text-[#1E8221]"
                    : (orgMetricsAdminQeurry?.data?.status === "DELETED" ? " text-destructive/80 bg-destructive/20" : "bg-[#FFF3D9] text-[#A2781E]") 
                } text-[13px] font-medium px-3 py-1 rounded-full`}
                >
                  {orgMetricsAdminQeurry?.data?.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4  flex-[0_0_50%]">

          <div className="flex gap-5 2xl:gap-10 w-full" >
            <Separator orientation="vertical" className=" !h-14 text-[#F4ECE6]" />
                <div className="w-full xl:whitespace-nowrap" >
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Associated Organization</p>
              <p className="font-semibold mt-1 2xl:text-2xl">{orgMetricsAdminQeurry?.relationship?.organisationFirstName|| "-"}</p>
            </div>
              <Separator orientation="vertical" className=" !h-14 text-[#F4ECE6]" />
            <div className="w-full xl:whitespace-nowrap" >
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Account Created</p>
              <p className="font-semibold mt-1 2xl:text-2xl">{format(orgMetricsAdminQeurry?.data?.createdAt, "MMM dd, yyyy")}</p>
            </div>
            <Separator orientation="vertical" className="!h-14 text-[#F4ECE6]" />
            <div className="w-full  xl:whitespace-nowrap" >
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Last Activity</p>
              <p className="font-semibold mt-1 2xl:text-2xl">{format(orgMetricsAdminQeurry?.data?.lastLogin, "MMM dd, yyyy")}</p>
            </div>
          </div>

          <div className="border border-[#E3D8D2] rounded-md p-4 max-w-[9rem] min-w-[8rem] w-full text-center xl:whitespace-nowrap">
            <p className="text-[#6B5E55]">Search Count</p>
            <p className="font-semibold text-2xl text-[#2A1A14]">{orgMetricsAdminQeurry?.data?.searchCount}</p>
          </div>

        
        </div>
      </div>
    )
}