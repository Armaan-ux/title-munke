import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
const AgentPropertyDetails = () => {
      const navigate = useNavigate();
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
        {/* <div className="flex items-center justify-left gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#5a0a0a] hover:text-[#3d0606] transition"
          >
            <ChevronLeft className="w-6 h-6 mr-1" />
          </button>
          <p className="text-md  text-secondary">Back</p>
        </div> */}
         <div className="flex items-center gap-4 rounded-xl w-full max-w-[720px] ">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src="/agent.png" // replace with your image path
          alt="John Smith"
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <h3 className="text-[20px] font-semibold text-secondary leading-tight">
          John Smith
        </h3>
        <p className="text-[14px] text-secondary/70 leading-snug">
          Property searches this month:{" "}
          <span className="font-semibold text-secondary">24</span>
        </p>
        <a
          href="mailto:john@email.com"
          className="text-[14px] text-secondary hover:underline mt-[2px]"
        >
          john@email.com
        </a>
      </div>
    </div>
      </div>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
             <h3 className="text-[20px] py-3 px-1 text-secondary leading-tight">
          Recent Properties Searches
        </h3>
          <Table className="">
            <TableHeader className="bg-[#F5F0EC]">
              <TableRow>
                <TableHead className="w-[100px]">Sr. No.</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
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
                        <Badge className={`${item?.status === "Active"
                            ? "bg-[#E9F3E9] text-[#1E8221]"
                            : "bg-[#FFF3D9] text-[#A2781E]"} text-[13px] font-medium px-3 py-1 rounded-full`}>
                          {item?.status}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-row">
                        <Button
                          size="icon"
                          className="text-md"
                          variant="ghost"
                          onClick={() =>
                            navigate("broker/property-details/123")
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

          {/* {!hasMore && <p>No more data to load.</p>}
          {logs?.length > 0 && hasMore && !loading && (
            <button className="loadmore mt-4">Load More</button>
          )} */}
        </div>
      </div>
    </>
  )
}

export default AgentPropertyDetails