import { useState } from "react";
// import "./index.css";
import { getFormattedDateTime, queryKeys } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Link,
  Share2,
  Printer,
  Eye,
  ChevronLeft,
  ArrowDownToLine,
  Pencil,
  Trash2,
  PencilLine,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DateFilter from "../common/date-filter";
import BackBtn from "../back-btn";
import UserDetailHeader from "../user-detail-header";
import { useQuery } from "@tanstack/react-query";
import { getBrokerAgentsDetails } from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";

function BrokerDetails() {
  const navigate = useNavigate();
  // const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const {id} = useParams();
  const brokersAgentListingAdminQuery = useQuery({
    queryKey: [queryKeys.brokersAgentListingAdmin, id],
    queryFn: () => getBrokerAgentsDetails(id, true),
    enabled: !!id,
  })
  const logs = [
    {
      id: "1",
      name: "John Doe",
      lastActivity: "2024-06-10 14:30",
      searchCount: "20",
    },
    {
      id: "2",
      name: "Jane Smith",
      searchCount: "15",
      lastActivity: "2024-06-09 10:15",
    },
  ];
  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-4 my-4 text-secondary">
        <BackBtn />
        {/* <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
          </button>
          <p className="text-lg text-secondary">Back</p>
        </div> */}
      </div>
      <UserDetailHeader />
        {/* <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary flex items-center justify-between w-full gap-1">
        
      <div className="flex items-center gap-4">
        <img
          src="/agent.png"
          alt="User"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="text-[#2A1A14] font-semibold text-lg">James Anderson</p>
          <p className="text-[#6B5E55] text-sm">andrew@email.com</p>
          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="w-2 h-2 bg-[#B89C65] rounded-full"></span>
            <span className="text-[#B89C65]">Inactive</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 text-sm text-[#2A1A14]">
        <div>
          <p className="text-[#6B5E55]">Account Created</p>
          <p className="font-semibold mt-1">Jan 02, 2024</p>
        </div>
        <div>
          <p className="text-[#6B5E55]">Last Activity</p>
          <p className="font-semibold mt-1">Oct 8, 2025</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="border border-[#E3D8D2] rounded-md px-4 py-2 text-center">
          <p className="text-[#6B5E55] text-sm">Search Count</p>
          <p className="font-semibold text-lg text-[#2A1A14]">27</p>
        </div>

        <div className="border border-[#E3D8D2] rounded-md px-4 py-2 text-center bg-white">
          <p className="text-[#6B5E55] text-sm">Business</p>
          <p className="font-semibold text-lg text-[#2A1A14]">$60</p>
        </div>

        <div className="flex gap-2 ml-2">
          <button className="text-[#6B5E55] hover:text-[#550000]">
            <PencilLine className="w-4 h-4" />
          </button>
          <button className="text-[#6B5E55] hover:text-[#550000]">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      </div> */}
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-6">
            <p className="text-secondary font-medium text-xl">All Agents</p>
          </div>
            <DateFilter />
        </div>
          {brokersAgentListingAdminQuery?.isLoading && <CenterLoader />}
          {brokersAgentListingAdminQuery?.isError && <ShowError message={brokersAgentListingAdminQuery?.error?.response?.data?.message} />}
          {brokersAgentListingAdminQuery?.isSuccess &&
            <Table className="">
              <TableHeader className="bg-[#F5F0EC]">
                <TableRow>
                  <TableHead>Sr. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-center" >Searches</TableHead>
                  <TableHead className="text-center" >Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-black" >  
                {brokersAgentListingAdminQuery?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="font-medium text-center py-10"
                    >
                      No Records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  brokersAgentListingAdminQuery?.data?.map((item, index) => (
                    <TableRow key={item.id} className="text-black" >
                      <TableCell >{index + 1}</TableCell>
                      <TableCell >{item?.agentName}</TableCell>
                      <TableCell>
                        {getFormattedDateTime(item?.lastLogin)}
                        </TableCell>
                      <TableCell className="text-center" >{item?.totalSearches}</TableCell>
                      <TableCell className="text-center" >
                          <Button
                            size="icon"
                            className="text-md"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/admin/property-search/${item?.agentId}`)
                            }
                          >
                            <Eye />
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          }

          {/* {!hasMore && <p>No more data to load.</p>}
          {logs?.length > 0 && hasMore && !loading && (
            <div className="flex justify-center" >
              <button className=" mt-4">Load More</button>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}

export default BrokerDetails;
