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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRequestToJoinUser,
  listRequestByUserId,
  processLeaveRequestToJoinUser,
  processRequestToJoinUser,
  withdrawRequestToJoinUser,
} from "@/components/service/userAdmin";
import { CenterLoader } from "@/components/common/Loader";

import { queryKeys } from "@/utils";
import { useState } from "react";
import { Check, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
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

const LoaderRow = ({ colSpan }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center py-10">
      <CenterLoader />
    </TableCell>
  </TableRow>
);

const EmptyRow = ({ colSpan }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center py-10">
      No Records found.
    </TableCell>
  </TableRow>
);

const ActionButtons = ({
  onApprove,
  onReject,
  onRetry,
  onDelete,
  disabled,
}) => (
  <div className="flex gap-2">
    {onApprove && (
      <Button
        className="p-2 rounded-md hover:bg-[#eef9ff] text-secondary bg-[#F5F0EC]"
        disabled={disabled}
        onClick={onApprove}
      >
        <Check size={16} />
      </Button>
    )}
    {onRetry && (
      <Button
        className="p-2 rounded-md hover:bg-[#eef9ff] text-secondary bg-[#F5F0EC]"
        disabled={disabled}
        onClick={onRetry}
      >
        <RefreshCcw size={16} />
      </Button>
    )}
    {(onReject || onDelete) && (
      <Button
        className="p-2 rounded-md hover:bg-[#eef9ff] text-[#FF645E] bg-[#F5F0EC]"
        disabled={disabled}
        onClick={onReject || onDelete}
      >
        <Trash2 size={16} />
      </Button>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles =
    status === "Success" || status === "Completed"
      ? "bg-[#E9F3E9] text-[#1E8221]"
      : status === "Updated"
        ? "bg-[#eef9ff] text-[#2494C7]"
        : "bg-[#FFF3D9] text-[#A2781E]";

  return (
    <Badge className={`${styles} text-[13px] px-3 py-1 rounded-md`}>
      {status}
    </Badge>
  );
};
const RequestListTable = ({
  data = [],
  isRequestPending,
  activeTab,
  onApprove,
  onReject,
  processJoinRequestMutation,
  processLeaveRequestMutation,
}) => {
  const showAction = activeTab === "pending";

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        <Table>
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead className="w-[100px]">Sr. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email / Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              {showAction && <TableHead>Action</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isRequestPending ? (
              <LoaderRow colSpan={showAction ? 6 : 5} />
            ) : data?.length === 0 ? (
              <EmptyRow colSpan={showAction ? 6 : 5} />
            ) : (
              data?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name?.toUpperCase()}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{getFormattedDateTime(item.updatedAt)}</TableCell>
                  <TableCell>{item.requestMessage}</TableCell>

                  {showAction && (
                    <TableCell>
                      <ActionButtons
                        disabled={
                          processJoinRequestMutation?.isPending ||
                          processLeaveRequestMutation?.isPending
                        }
                        onApprove={() => onApprove(item)}
                        onReject={() => onReject(item)}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const MyRequestList = ({
  data = [],
  isRequestPending,
  onRetry,
  onDelete,
  newJoinRequestMutation,
  withdrawRequestMutation,
}) => {
  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        <Table>
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
              <LoaderRow colSpan={5} />
            ) : data?.length === 0 ? (
              <EmptyRow colSpan={5} />
            ) : (
              data?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name?.toUpperCase()}</TableCell>
                  <TableCell>{getFormattedDateTime(item.updatedAt)}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <ActionButtons
                      disabled={
                        newJoinRequestMutation.isPending ||
                        withdrawRequestMutation.isPending
                      }
                      onRetry={() => onRetry(item)}
                      onDelete={() => onDelete(item.id)}
                    />
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
  const { userId, userType } = useUserIdType();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(brokerTypes[0]);
  const [processingId, setProcessingId] = useState(null);

  const tabToApiParam = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    request: "myRequest",
  };

  const { data: requestList = [], isPending: isRequestPending } = useQuery({
    queryKey: [queryKeys.listRequestsByUserId, activeTab.id],
    queryFn: () => listRequestByUserId(tabToApiParam[activeTab.id]),
    enabled: !!userId,
    keepPreviousData: true,
  });
  const newJoinRequestMutation = useMutation({
    mutationFn: addRequestToJoinUser,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listRequestsByUserId, activeTab.id],
      });

      toast.success(
        variables?.actionType === "retry"
          ? "Request retried successfully"
          : "Request sent successfully",
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    },
  });
  const processJoinRequestMutation = useMutation({
    mutationFn: processRequestToJoinUser,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listRequestsByUserId, activeTab.id],
      });

      toast.success(
        variables?.action === "accept"
          ? "Request approved successfully"
          : variables?.action === "reject"
            ? "Request rejected successfully"
            : "Request sent successfully",
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    },
  });

  const processLeaveRequestMutation = useMutation({
    mutationFn: processLeaveRequestToJoinUser,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listRequestsByUserId, activeTab.id],
      });

      toast.success(
        variables?.action === "accept"
          ? "Request approved successfully"
          : variables?.action === "reject"
            ? "Request rejected successfully"
            : "Request sent successfully",
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    },
  });

  const buildRetryPayload = (item) => {
    const user = userType === "broker" ? "organisation" : "";
    return {
      requestId: item.id,
      actionType: "retry",
      userId: item.organisationId,
      userType: user,
      ...(item?.requestMessage && { message: item.requestMessage }),
    };
  };
  // const buildRetryPayload = (item) => ({
  //   requestId: item.id,
  //   organizationId: item.organizationId,
  //   note: item.description,
  //   actionType: "retry",
  // });
  const withdrawRequestMutation = useMutation({
    mutationFn: withdrawRequestToJoinUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listRequestsByUserId, activeTab.id],
      });

      toast.success("Request withdrawn successfully");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong while withdrawing request.",
      );
    },
  });
  const handleRetry = (item) => {
    if (!item?.id || newJoinRequestMutation.isPending) return;

    newJoinRequestMutation.mutate({
      ...buildRetryPayload(item),
      actionType: "retry",
    });
  };
  const handleDelete = (id) => {
    if (!id || withdrawRequestMutation.isPending) return;

    withdrawRequestMutation.mutate({ requestId: id });
  };
  const handleApprove = (item) => {
    console.log("Approving item", item);
    const id = item?.id;
    if (!id || processingId === id) return;

    setProcessingId(id);
    if (item?.requestType === "LEAVE") {
      processLeaveRequestMutation.mutate(
        { requestId: id, action: "accept" },
        { onSettled: () => setProcessingId(null) },
      );
    }
    if (item?.requestType === "JOIN") {
      processJoinRequestMutation.mutate(
        { requestId: id, action: "accept" },
        { onSettled: () => setProcessingId(null) },
      );
    }
  };

  const handleReject = (item) => {
    const id = item?.id;
    console.log("Rejecting item", item);
    if (!id || processingId === id) return;

    setProcessingId(id);

    if (item?.requestType === "LEAVE") {
      processLeaveRequestMutation.mutate(
        { requestId: id, action: "reject" },
        { onSettled: () => setProcessingId(null) },
      );
    }

    if (item?.requestType === "JOIN") {
      processJoinRequestMutation.mutate(
        { requestId: id, action: "reject" },
        { onSettled: () => setProcessingId(null) },
      );
    }
  };

  const data = requestList?.data || [];
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

      {activeTab.id === "request" ? (
        <MyRequestList
          data={data}
          isRequestPending={isRequestPending}
          onRetry={handleRetry}
          onDelete={handleDelete}
          newJoinRequestMutation={newJoinRequestMutation}
          withdrawRequestMutation={withdrawRequestMutation}
        />
      ) : (
        <RequestListTable
          data={data}
          isRequestPending={isRequestPending}
          activeTab={activeTab.id}
          onApprove={handleApprove}
          onReject={handleReject}
          processRequestMutation={processJoinRequestMutation}
          processLeaveRequestMutation={processLeaveRequestMutation}
        />
      )}
    </div>
  );
}
