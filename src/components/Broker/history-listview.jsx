import { useState } from "react";
// import "./index.css";
import { getFormattedDateTime } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link as LinkIcon, Share2, Printer, Eye, ChevronLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BackBtn from "../back-btn";
import BrokerHistory from "./broker-history";
import SearchHistory from "@/components/Individual/search-history";
import AgentHistory from "@/components/common/history";
import { useUserIdType } from "@/hooks/useUserIdType";
function HistoryListview() {
  const {userType} = useUserIdType();
  const navigate = useNavigate();
  // const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const logs = [
    {
      id: "1",
      address: "123 Main St, Springfield, IL 62701",
      status: "Unsuccessful",
      createdAt: "2023-03-01T00:00:00.000Z",
    },
    {
      id: "2",
      address: "456 Elm St, Springfield, IL 62702",
      status: "Successfull",
      createdAt: "2023-03-01T00:00:00.000Z",
    },
  ];
  const currentRoute  = useLocation();
  console.log('currentRoute', currentRoute)
  // return <BrokerHistory isAll={true}/>
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
      {userType === "broker" && <BrokerHistory isAll={true}/>}
      {userType === "individual" && <SearchHistory isAll={true}/>}
      {userType === "agent" && <AgentHistory isAll={true}/>}
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary hidden">
        <div className="bg-white !p-4 rounded-xl">
          <Table className="">
            <TableHeader className="bg-[#F5F0EC]">
              <TableRow>
                <TableHead className="w-[100px]">Sr. No.</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead className="text-center" >Status</TableHead>
                <TableHead className="text-center" >Download Link</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="font-medium text-center py-10"
                  >
                    No Records found.
                  </TableCell>
                </TableRow>
              ) : (
                logs?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {item.address}
                    </TableCell>
                    <TableCell>
                      {getFormattedDateTime(item?.createdAt)}
                    </TableCell>
                    <TableCell className="text-center" >
                      <Badge
                        className={`${
                          item?.status === "Successfull"
                            ? "bg-[#E9F3E9] text-[#1E8221]"
                            : "bg-[#FFF3D9] text-[#A2781E]"
                        } text-[13px] font-medium px-3 py-1 rounded-full`}
                      >
                        {item?.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center" >
                      <Button variant="ghost" size="icon">
                        <LinkIcon className="w-4 h-4 mx-auto" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-row">
                        <Button size="icon" className="text-md" variant="ghost">
                          <Share2 />
                        </Button>
                        <Button size="icon" className="text-md" variant="ghost">
                          <Printer />
                        </Button>
                      
                      <Link to={ currentRoute.pathname.startsWith("/agent") ?  
                        "/agent/property-details/123" : 
                        currentRoute.pathname.startsWith("/broker") ?
                        "/broker/property-details/123"
                        :
                        "/individual/property-details/123"
                      } >
                        <Button
                          size="icon"
                          className="text-md"
                          variant="ghost"
                          >
                          <Eye />
                        </Button>
                      </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* {!hasMore && <p>No more data to load.</p>}
          {logs?.length > 0 && hasMore && !loading && (
            <button className="loadmore mt-4">Load More</button>
          )} */}
        </div>
      </div>
      
    </>
  );
}

export default HistoryListview;
