import { useState } from "react";
// import "./index.css";
import { queryKeys } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DateFilter from "../common/date-filter";
import { Separator } from "../ui/separator";
import BackBtn from "../back-btn";

import AgentDetailHeader from "../common/AgentHeader";
import { useQuery } from "@tanstack/react-query";
import { getAgentDetails, getAgentSearches } from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { format } from "date-fns-tz";

function PropertySearch() {
  const [date, setDate] = useState({fromDatetime: null, toDatetime: null});
  const {id} = useParams();
  const agentSearchesQuery = useQuery({
    queryKey: [queryKeys.agentSearchesAdmin, id, date.fromDatetime, date.toDatetime],
    queryFn: () => getAgentSearches(id, date?.fromDatetime, date?.toDatetime),
    enabled: !!id,
  })
  const agentMetricsAdminQeurry = useQuery({
    queryKey: [queryKeys.agentMetricsAdmin, id],
    queryFn: () => getAgentDetails(id),
    enabled: !!id
  })
  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
      </div>
      {agentMetricsAdminQeurry?.isLoading && <div className="h-auto"><CenterLoader /></div>}
      {agentMetricsAdminQeurry?.isError && <ShowError message={agentMetricsAdminQeurry?.error?.response?.data?.message} />}
      {agentMetricsAdminQeurry?.isSuccess && <AgentDetailHeader data={agentMetricsAdminQeurry?.data}/>}
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-6">
              <p className="text-secondary font-medium text-xl">
                Properties Searches
              </p>
            </div>
            <DateFilter handleFilter={(fromDatetime, toDatetime) => setDate(pre => ({...pre, fromDatetime, toDatetime}))}/>
          </div>
          {agentSearchesQuery?.isLoading && <CenterLoader />}
          {agentSearchesQuery?.isError && <ShowError message={agentSearchesQuery?.error?.response?.data?.message}/>}
          {agentSearchesQuery?.isSuccess &&
            <Table className="">
              <TableHeader className="bg-[#F5F0EC]">
                <TableRow>
                  <TableHead >Sr. No.</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Searched Date</TableHead>
                  <TableHead className="text-center" >Status</TableHead>
                  {/* <TableHead className="text-center" >Action</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody className="text-black" >
                {agentSearchesQuery?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="font-medium text-center py-10"
                    >
                      No Records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  agentSearchesQuery?.data?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell >{index + 1}</TableCell>
                      <TableCell >
                        {item.address}
                      </TableCell>
                      <TableCell>{format(item?.createdAt, "MMM d, yyyy, HH:mm:ss")}</TableCell>
                      <TableCell className="text-center" >
                        {" "}
                        <Badge
                          className={`${
                            item?.status === "SUCCESS"
                              ? "bg-[#E9F3E9] text-[#1E8221]"
                              : "bg-[#FFF3D9] text-[#A2781E]"
                          } text-[13px] font-medium px-3 py-1 rounded-full`}
                        >
                          {item?.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          }
        </div>
      </div>
    </>
  );
}

export default PropertySearch;
