import { useState } from "react";
import { getFormattedDateTime } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function AuditLogs() {
  //   const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const logs = [
    {
      id: "1",
      detail: "Agent logged in successfully",
      email: "6Wv6o@example.com",
      status: "Success",
      date: "2023-03-01T00:00:00.000Z",
      action: "Login",
    },
  ];

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        <Table className="">
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Date & Time </TableHead>
              <TableHead>Action Performed</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
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
                    {getFormattedDateTime(item.date)}
                  </TableCell>
                  <TableCell>{item?.action}</TableCell>
                  <TableCell>{item.detail}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        item?.status === "Success" ||
                        item?.status === "Completed"
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
{/* 
        {!hasMore && <p>No more data to load.</p>}
        {logs?.length > 0 && hasMore && !loading && (
          <button className="loadmore">Load More</button>
        )} */}
      </div>
    </div>
  );
}

export default AuditLogs;
