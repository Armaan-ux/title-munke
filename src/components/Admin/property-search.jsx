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
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DateFilter from "../common/date-filter";
import { Separator } from "../ui/separator";

function PropertySearch() {
  const navigate = useNavigate();
  // const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const logs = [
    {
      id: "1",
      address: "San Francisco, CA 94103",
      searchDate: "2024-06-10 14:30",
      business: "$20",
      status: "Unsuccessful",
    },
    {
      id: "2",
      address: "Fremont, CA 94536",
      searchDate: "2024-06-09 10:15",
      business: "$15",
      status: "Successful",
    },
  ];
  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
          </button>
          <p className="text-lg text-secondary">Back</p>
        </div>
      </div>
      <div className="bg-[#F5F0EC] rounded-lg py-5 px-7 my-4 text-secondary flex items-center justify-between  gap-1">
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

            <Separator orientation="vertical" className="w-3 !h-14 text-[#F4ECE6]" />
        <div className="flex items-center justify-between gap-4">

          <div className="flex gap-5 2xl:gap-10 mr-4 2xl:mr-6" >
            <div>
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Account Created</p>
              <p className="font-semibold mt-1 2xl:text-2xl">Jan 02, 2024</p>
            </div>
            <Separator orientation="vertical" className="w-3 !h-14 text-[#F4ECE6]" />
            <div>
              <p className="text-[#6B5E55] text-sm 2xl:text-lg">Last Activity</p>
              <p className="font-semibold mt-1 2xl:text-2xl">Oct 8, 2025</p>
            </div>
          </div>

          <div className="border border-[#E3D8D2] rounded-md px-6 py-4 text-center ">
            <p className="text-[#6B5E55]">Search Count</p>
            <p className="font-semibold text-2xl text-[#2A1A14]">27</p>
          </div>

          <div className="border border-[#E3D8D2] rounded-md px-6 py-4  text-center bg-white mr-4">
            <p className="text-[#6B5E55] ">Business</p>
            <p className="font-semibold text-2xl text-[#2A1A14]">$60</p>
          </div>

          <div className="flex gap-8 ml-2">
            <button className="text-[#6B5E55] hover:text-[#550000] cursor-pointer">
              <PencilLine size={18} />
            </button>
            <button className="text-[#6B5E55] hover:text-[#550000] cursor-pointer">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-6">
              <p className="text-secondary font-medium text-xl">
                Properties Searches
              </p>
            </div>
            <DateFilter />
          </div>
          <Table className="">
            <TableHeader className="bg-[#F5F0EC]">
              <TableRow>
                <TableHead >Sr. No.</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Searched Date</TableHead>
                <TableHead className="text-center" >Business</TableHead>
                <TableHead className="text-center" >Status</TableHead>
                <TableHead className="text-center" >Action</TableHead>
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
                    <TableCell>{item?.searchDate}</TableCell>
                    <TableCell className="text-center" >{item?.business}</TableCell>
                    <TableCell className="text-center" >
                      {" "}
                      <Badge
                        className={`${
                          item?.status === "Successful"
                            ? "bg-[#E9F3E9] text-[#1E8221]"
                            : "bg-[#FFF3D9] text-[#A2781E]"
                        } text-[13px] font-medium px-3 py-1 rounded-full`}
                      >
                        {item?.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-row justify-center">
                        <Button
                          size="icon"
                          className="text-md"
                          variant="ghost"
                          onClick={() =>
                            navigate("/broker/property-details/123")
                          }
                        >
                          <Eye />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {!hasMore && <p>No more data to load.</p>}
          {logs?.length > 0 && hasMore && !loading && (
            <button className="loadmore mt-4">Load More</button>
          )}
        </div>
      </div>
    </>
  );
}

export default PropertySearch;
