import { getFormattedDateTime } from "@/utils";
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
import { useState, useMemo, useCallback } from "react";
import { Check, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { AgGridReact } from "ag-grid-react";

const brokerTypes = [
  { name: "Pending", id: "pending" },
  { name: "Approved", id: "approved" },
  { name: "Rejected", id: "rejected" },
  { name: "My Requests", id: "request" },
];

// ─── Cell Renderers ───────────────────────────────────────────────────────────

const SrNoRenderer = (props) => <span>{props.node.rowIndex + 1}</span>;

const StatusRenderer = (props) => {
  const status = props.data?.status;
  const styles =
    status === "Success" || status === "Completed"
      ? "bg-[#E9F3E9] text-[#1E8221]"
      : status === "Updated"
        ? "bg-[#eef9ff] text-[#2494C7]"
        : "bg-[#FFF3D9] text-[#A2781E]";

  return (
    <div className="flex items-center h-full">
      <Badge className={`${styles} text-[13px] px-3 py-1 rounded-md`}>
        {status}
      </Badge>
    </div>
  );
};

const ActionButtonsRenderer = (props) => {
  const { onApprove, onReject, onRetry, onDelete, disabled } = props;
  return (
    <div className="flex items-center gap-2 h-full">
      {onApprove && (
        <Button
          className="p-2 rounded-md hover:bg-[#eef9ff] text-secondary bg-[#F5F0EC]"
          disabled={disabled}
          onClick={() => onApprove(props.data)}
        >
          <Check size={16} />
        </Button>
      )}
      {onRetry && (
        <Button
          className="p-2 rounded-md hover:bg-[#eef9ff] text-secondary bg-[#F5F0EC]"
          disabled={disabled}
          onClick={() => onRetry(props.data)}
        >
          <RefreshCcw size={16} />
        </Button>
      )}
      {(onReject || onDelete) && (
        <Button
          className="p-2 rounded-md hover:bg-[#eef9ff] text-[#FF645E] bg-[#F5F0EC]"
          disabled={disabled}
          onClick={() =>
            onReject ? onReject(props.data) : onDelete(props.data?.id)
          }
        >
          <Trash2 size={16} />
        </Button>
      )}
    </div>
  );
};

// ─── RequestListTable (Pending / Approved / Rejected tabs) ───────────────────

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
  const isActionDisabled =
    processJoinRequestMutation?.isPending ||
    processLeaveRequestMutation?.isPending;

  const columnDefs = useMemo(() => {
    const cols = [
      {
        headerName: "Sr. No.",
        field: "index",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Name",
        field: "name",
        valueGetter: (params) => params.data?.name?.toUpperCase(),
        flex: 1,
        minWidth: 160,
        filter: false,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Email / Phone",
        field: "email",
        flex: 1,
        minWidth: 180,
        filter: false,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Date",
        field: "updatedAt",
        valueGetter: (params) => getFormattedDateTime(params.data?.updatedAt),
        flex: 1,
        minWidth: 180,
        filter: false,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Description",
        field: "requestMessage",
        flex: 2,
        minWidth: 200,
        filter: false,
         wrapText: true,
        autoHeight: true,
      },
    ];

    if (showAction) {
      cols.push({
        headerName: "Action",
        field: "action",
        cellRenderer: ActionButtonsRenderer,
        cellRendererParams: {
          onApprove,
          onReject,
          disabled: isActionDisabled,
        },
        flex: 1,
        minWidth: 120,
        filter: false,
        sortable: false,
      });
    }

    return cols;
  }, [showAction, onApprove, onReject, isActionDisabled]);

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        {isRequestPending ? (
          <CenterLoader />
        ) : (
          <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
          
              <AgGridReact
                rowData={data}
                columnDefs={columnDefs}
                defaultColDef={{
                  flex: 1,
                  minWidth: 120,
                  filter: false,
                  sortable: true,
                  resizable: true,
                  unSortIcon: true,
                  wrapHeaderText: true,
                  autoHeaderHeight: true,
                }}
                rowHeight={72}
                headerHeight={48}
                domLayout="autoHeight"
                animateRows={true}
                overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
              />
            
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MyRequestList ("My Requests" tab) ───────────────────────────────────────

const MyRequestList = ({
  data = [],
  isRequestPending,
  onRetry,
  onDelete,
  newJoinRequestMutation,
  withdrawRequestMutation,
}) => {
  const isActionDisabled =
    newJoinRequestMutation.isPending || withdrawRequestMutation.isPending;

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        field: "index",
        cellRenderer: SrNoRenderer,
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        flex: 0,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Organization Name",
        field: "name",
        valueGetter: (params) => params.data?.name?.toUpperCase(),
        flex: 2,
        minWidth: 200,
        filter: false,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Date & Time",
        field: "updatedAt",
        valueGetter: (params) => getFormattedDateTime(params.data?.updatedAt),
        flex: 1,
        minWidth: 180,
        filter: false,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusRenderer,
        flex: 1,
        minWidth: 140,
        filter: false,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Action",
        field: "action",
        cellRenderer: ActionButtonsRenderer,
        cellRendererParams: {
          onRetry,
          onDelete,
          disabled: isActionDisabled,
        },
        flex: 1,
        minWidth: 120,
        filter: false,
        sortable: false,
      },
    ],
    [onRetry, onDelete, isActionDisabled],
  );

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        {isRequestPending ? (
          <CenterLoader />
        ) : (
          <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
           
              <AgGridReact
                rowData={data}
                columnDefs={columnDefs}
                defaultColDef={{
                  flex: 1,
                  minWidth: 120,
                  filter: false,
                  sortable: true,
                  resizable: true,
                  unSortIcon: true,
                  wrapHeaderText: true,
                  autoHeaderHeight: true,
                }}
                rowHeight={72}
                headerHeight={48}
                domLayout="autoHeight"
                animateRows={true}
                overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
              />
          
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────

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

  const handleRetry = useCallback(
    (item) => {
      if (!item?.id || newJoinRequestMutation.isPending) return;
      newJoinRequestMutation.mutate({
        ...buildRetryPayload(item),
        actionType: "retry",
      });
    },
    [newJoinRequestMutation],
  );

  const handleDelete = useCallback(
    (id) => {
      if (!id || withdrawRequestMutation.isPending) return;
      withdrawRequestMutation.mutate({ requestId: id });
    },
    [withdrawRequestMutation],
  );

  const handleApprove = useCallback(
    (item) => {
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
    },
    [processingId, processJoinRequestMutation, processLeaveRequestMutation],
  );

  const handleReject = useCallback(
    (item) => {
      const id = item?.id;
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
    },
    [processingId, processJoinRequestMutation, processLeaveRequestMutation],
  );

  const data = requestList?.data || [];

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 mt-3 text-secondary">
      <div className="space-x-3 mb-4">
        {brokerTypes.map((item) => (
          <button
            key={item.id}
            className={`${
              activeTab.id === item.id
                ? "bg-tertiary text-white"
                : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055]"
            } transition-all rounded-full px-10 py-3`}
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
          processJoinRequestMutation={processJoinRequestMutation}
          processLeaveRequestMutation={processLeaveRequestMutation}
        />
      )}
    </div>
  );
}