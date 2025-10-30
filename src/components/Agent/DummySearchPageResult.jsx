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
import { Link, Share2, Printer, Eye, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function DummySearchPageResult() {
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
      status: "Active",
      createdAt: "2023-03-01T00:00:00.000Z",
    },
  ];
  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
          </button>
          <p className="text-md  text-secondary">Back</p>
        </div>
      </div>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          <Table className="">
            <TableHeader className="bg-[#F5F0EC]">
              <TableRow>
                <TableHead className="w-[100px]">Sr. No.</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Download Link</TableHead>
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
                    <TableCell>
                      <Badge
                        className={`${
                          item?.status === "Active"
                            ? "bg-[#E9F3E9] text-[#1E8221]"
                            : "bg-[#FFF3D9] text-[#A2781E]"
                        } text-[13px] font-medium px-3 py-1 rounded-full`}
                      >
                        {item?.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link className="w-4 h-4" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-row">
                        <Button size="icon" className="text-md" variant="ghost">
                          <Share2 />
                        </Button>
                        <Button size="icon" className="text-md" variant="ghost">
                          <Printer />
                        </Button>

                        <Button
                          size="icon"
                          className="text-md"
                          variant="ghost"
                          onClick={() =>
                            navigate("/agent/property-details/123")
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

export default DummySearchPageResult;
