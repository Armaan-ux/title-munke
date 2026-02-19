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
import { useUserIdType } from "@/hooks/useUserIdType";
import { useQueryClient , useMutation, useQuery } from "@tanstack/react-query";
import { addRequestToJoinUser, listRequestByUserId, withdrawRequestToJoinUser } from "@/components/service/userAdmin";
import { CenterLoader } from "@/components/common/Loader";

import { queryKeys } from "@/utils";
import { useState } from "react";
import { RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
const agentTypes = [
  {
    name: "My Requests",
    id: "request",
  },
];

const RequestListTable = () => {
  const { userId,userType } = useUserIdType();
  const queryClient = useQueryClient();
  const { data: requestList, isPending: isRequestPending } = useQuery({
    queryKey: [queryKeys.listRequestsByUserId],
    queryFn: () => listRequestByUserId("myRequest"),
    skip: !userId,
  });
  console.log("Request List:", requestList);
 
  const logs = requestList?.data || [];

const newJoinRequestMutation = useMutation({
  mutationFn: addRequestToJoinUser,

  onSuccess: (_, variables) => {
    // Refresh request list
    queryClient.invalidateQueries([queryKeys.listRequestsByUserId]);

    toast.success(
      variables?.actionType === "retry"
        ? "Request retried successfully"
        : "Request sent successfully"
    );
  },

  onError: (error) => {
    const message =
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";

    toast.error(message);
  },
});
const withdrawRequestMutation = useMutation({
  mutationFn: withdrawRequestToJoinUser,
  onSuccess: () => {
    queryClient.invalidateQueries([queryKeys.listRequestsByUserId]);
    toast.success("Request withdrawn successfully");
  },
  onError: (error) => {
    toast.error(
      error?.response?.data?.error ||
        "Something went wrong while withdrawing request."
    );
  },
});


const buildRetryPayload = (item) => {
  const user = userType === "agent" ? "broker" : "";
  return {
    actionType: "retry",
    requestId: item?.id,
    userType: user,
    userId: item?.brokerId,
    ...(item?.requestMessage && { message: item.requestMessage }),
  };
};


  const handleRetry = (item) => {
    if (!item?.id || newJoinRequestMutation.isPending) return;
  newJoinRequestMutation.mutate(buildRetryPayload(item));
  }
  const handleDelete = (id) => {
     if (!id || withdrawRequestMutation.isPending) return;
  withdrawRequestMutation.mutate({ requestId: id });
  }

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        <Table className="">
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead className="w-[100px]">Sr. No.</TableHead>
              <TableHead>Broker Name</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Request Type</TableHead>
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
                    {item.name?.toUpperCase() || "N/A"}
                  </TableCell>
                  <TableCell>{getFormattedDateTime(item?.updatedAt)}</TableCell>
                  <TableCell>{item?.requestType}</TableCell>
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
                       disabled={newJoinRequestMutation.isPending}
                        className="p-2 rounded-md hover:bg-[#eef9ff] text-[#000000] bg-[#F5F0EC]"
                        onClick={() => handleRetry(item)}
                      >
                        <RefreshCcw size={16} />
                      </button>

                      {/* Cross icon */}
                      <button
                        className="p-2 rounded-md  hover:bg-[#FFE3D9] text-[#FF0000] bg-[#F5F0EC]"
                        onClick={() => handleDelete(item.id)}
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
export default function Requests() {
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
