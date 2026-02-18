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
import {
  listRequestByUserId,
} from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";

import { queryKeys } from "@/utils";
import { useState } from "react";
import { Check, RefreshCcw, Trash2 } from "lucide-react";
const brokerTypes = [
  {
    name: "Pending",
    id: "pending",
  },
  {
    name: "Approved",
    id: "approved",
  },
  {
    name: "Rejected",
    id: "rejected",
  },
  {
    name: "My Requests",
    id: "request",
  },
];
const dummyData = [
  {
    id: 1,
    name: "John Doe",
    contact: "john@doe",
    date: "2023-03-01T00:00:00.000Z",
    description: "Wants pricing details",
    action: "Agent logged in successfully",
  },
  {
    id: 2,
    name: "John Doe",
    contact: "1234567890",
    date: "2023-03-01T00:00:00.000Z",
    description: "Wants pricing details",
    action: "Agent logged in successfully",
  },
  {
    id: 3,
    name: "John Doe",
    contact: "1231231230",
    date: "2023-03-01T00:00:00.000Z",
    description: "Wants pricing details",
    action: "Agent logged in successfully",
  },
];

const RequestListTable = ({ data, isRequestPending, activeTab }) => {

  //   const logs = auditLogs?.data?.items || []
  const logs = data || [];

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        <Table className="">
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead className="w-[100px]">Sr. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email / Phone Number</TableHead>
              <TableHead>Date (Received)</TableHead>
              <TableHead>Description</TableHead>
            {activeTab === "pending" && <TableHead>Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isRequestPending ? (
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
                  <TableCell>{item?.contact}</TableCell>
                  <TableCell>{getFormattedDateTime(item?.date)}</TableCell>
                  <TableCell>{item?.description}</TableCell>
               {activeTab === "pending" &&   <TableCell>
                    <div className="flex items-start gap-2 justify-start">
                      {/* Retry icon */}
                      <button
                        className="p-2 rounded-md hover:bg-[#eef9ff] text-[#000000] bg-[#F5F0EC]"
                        // onClick={() => handleRetry(item.id)}
                      >
                        <Check  size={16} />
                      </button>

                      {/* Cross icon */}
                      <button
                        className="p-2 rounded-md  hover:bg-[#FFE3D9] text-[#FF0000] bg-[#F5F0EC]"
                        // onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
const MyRequestList = ({ data, isRequestPending, activeTab })=>{

      const logs = data || [];
    return (<div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        <Table className="">
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead className="w-[100px]">Sr. No.</TableHead>
              <TableHead>Organization Name</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isRequestPending ? (
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
    </div>)
}
export default function Request() {
      const { userId } = useUserIdType();
  const { data: requestList, isPending: isRequestPending } = useQuery({
    queryKey: [queryKeys.listRequestsByUserId],
    queryFn: () => listRequestByUserId(),
    skip: !userId,
  });
  const [activeTab, setActiveTab] = useState(brokerTypes[0]);
  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 mt-3 text-secondary">
      <div className="space-x-3 mb-4">
        {brokerTypes.map((item, index) => (
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

      {activeTab.id === "pending" && <RequestListTable  data={dummyData} isRequestPending={isRequestPending} activeTab={activeTab?.id} />}
      {activeTab.id === "approved" && <RequestListTable  data={dummyData} isRequestPending={isRequestPending} activeTab={activeTab?.id} />}
      {activeTab.id === "rejected" && <RequestListTable  data={dummyData} isRequestPending={isRequestPending} activeTab={activeTab?.id} />}
      {activeTab.id === "request" && <MyRequestList  data={requestList} isRequestPending={isRequestPending} activeTab={activeTab?.id} />}
    </div>
  );
}
