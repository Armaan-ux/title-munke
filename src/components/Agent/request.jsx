import { getFormattedDateTime } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useQuery } from "@tanstack/react-query";
import { listAuditLogsByUserId } from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";

import { queryKeys } from "@/utils";
import { useState } from "react";
import { RefreshCcw, Trash2 } from "lucide-react";
const agentTypes = [
  {
    name: "My Requests",
    id: "request",
  },
];
const dummyData = [
  {
    id: 1,
    name: "John Doe",
    date_time: "2023-03-01T00:00:00.000Z",
    status: "In Progress",
    action: "Agent logged in successfully",
  },
  {
    id: 2,
    name: "John Doe",
    date_time: "2023-03-01T00:00:00.000Z",
    status: "In Progress",
    action: "Agent logged in successfully",
  },
  {
    id: 3,
    name: "John Doe",
    date_time: "2023-03-01T00:00:00.000Z",
    status: "In Progress",
    action: "Agent logged in successfully",
  },
];

const RequestListTable = () => {
  const { userId } = useUserIdType();
  const { data: auditLogs, isPending: isLogsPending } = useQuery({
    queryKey: [queryKeys.listAuditLogsByUserId],
    queryFn: () => listAuditLogsByUserId(userId),
    skip: !userId,
  });
  //   const logs = auditLogs?.data?.items || []
  const logs = dummyData || [];

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        <Table className="">
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead className="w-[100px]">Sr. No.</TableHead>
              <TableHead>Broker Name</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLogsPending ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="font-medium text-center py-10"
                >
                  <CenterLoader />
                </TableCell>
              </TableRow>
            ) : logs?.length === 0 ? (
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
                  <TableCell className="whitespace-pre-wrap">
                    {item.name}
                  </TableCell>
                  <TableCell>{getFormattedDateTime(item?.date_time)}</TableCell>
                  <TableCell>
                    <Badge
                      className={`!text-sm ${
                        item?.status === "Success" ||
                        item?.status === "Completed"
                          ? "bg-[#E9F3E9] text-[#1E8221]"
                          : item?.status === "Updated"
                            ? "bg-[#eef9ff] text-[#2494C7]"
                            : "bg-[#FFF3D9] text-[#A2781E]"
                      } text-[13px] font-medium px-3 py-1 rounded-md`}
                    >
                      {item?.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2 justify-start">
                      {/* Retry icon */}
                      <button
                        className="p-2 rounded-md hover:bg-[#eef9ff] text-[#000000] bg-[#F5F0EC]"
                        // onClick={() => handleRetry(item.id)}
                      >
                        <RefreshCcw size={16} />
                      </button>

                      {/* Cross icon */}
                      <button
                        className="p-2 rounded-md  hover:bg-[#FFE3D9] text-[#FF0000] bg-[#F5F0EC]"
                        // onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default function Request() {
  const [activeTab, setActiveTab] = useState(agentTypes[0]);
  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 mt-3 text-secondary">
      <div className="space-x-3 mb-4">
        {agentTypes.map((item, index) => (
          <button
            className={` ${
              activeTab.id === item.id
                ? "bg-tertiary text-white"
                : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] "
            } transition-all  rounded-full px-10 py-3 `}
            onClick={() => setActiveTab(item)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {activeTab.id === "request" && <RequestListTable />}
    </div>
  );
}
