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
import ConfirmDeleteModal from "@/components/Modal/ConfirmDeleteModal";

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
  const {data, onApproveClick, onRejectClick, onRetryClick, onDeleteClick, disabled } = props;
   const isAccepted = data?.status?.toUpperCase() === "ACCEPTED";
  return (
    <div className="flex items-center gap-2 h-full">
      {onApproveClick && (
        <Button
          className="p-2 rounded-md hover:bg-[#eef9ff] text-secondary bg-[#F5F0EC]"
          disabled={disabled}
          onClick={() => onApproveClick(props.data)}
        >
          <Check size={16} />
        </Button>
      )}
      {onRetryClick && !isAccepted && (
        <Button
          className="p-2 rounded-md hover:bg-[#eef9ff] text-secondary bg-[#F5F0EC]"
          disabled={disabled}
          onClick={() => onRetryClick(props.data)}
        >
          <RefreshCcw size={16} />
        </Button>
      )}
      {(onRejectClick || onDeleteClick) && (
        <Button
          className="p-2 rounded-md hover:bg-[#eef9ff] text-[#FF645E] bg-[#F5F0EC]"
          disabled={disabled}
          onClick={() =>
            onRejectClick ? onRejectClick(props.data) : onDeleteClick(props.data?.id)
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
  onApproveClick,
  onRejectClick,
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
          onApproveClick,
          onRejectClick,
          disabled: isActionDisabled,
        },
        flex: 1,
        minWidth: 120,
        filter: false,
        sortable: false,
      });
    }

    return cols;
  }, [showAction, onApproveClick, onRejectClick, isActionDisabled]);

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        {isRequestPending ? (
          <CenterLoader />
        ) : (
          <div
            className="ag-theme-quartz custom-ag-grid"
            style={{ width: "100%" }}
          >
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
  onRetryClick,
  onDeleteClick,
  newJoinRequestMutation,
  withdrawRequestMutation,
}) => {
  const isActionDisabled =
    newJoinRequestMutation.isPending || withdrawRequestMutation.isPending;
const OrganisationNameRenderer = (props) => (
  <span className="whitespace-pre-wrap">
    {props?.data?.requestType === "JOIN" ? props?.data?.toJoinName?.toUpperCase() : props?.data?.requestType === "LEAVE" ? props?.data?.toLeaveName?.toUpperCase() : "N/A"}
  </span>
);
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        field: "index",
        cellRenderer: SrNoRenderer,
        width: 100,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Organization Name",
        field: "toJoinName",
        cellRenderer: OrganisationNameRenderer,
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
          onRetryClick,
          onDeleteClick,
          disabled: isActionDisabled,
        },
        flex: 1,
        minWidth: 120,
        filter: false,
        sortable: false,
      },
    ],
    [onRetryClick, onDeleteClick, isActionDisabled],
  );

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        {isRequestPending ? (
          <CenterLoader />
        ) : (
          <div
            className="ag-theme-quartz custom-ag-grid"
            style={{ width: "100%" }}
          >
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
  
  // Modals for Pending tab (Approve/Reject)
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [pendingApproveItem, setPendingApproveItem] = useState(null);
  const [pendingRejectItem, setPendingRejectItem] = useState(null);
  
  // Modals for My Request tab (Retry/Delete)
  const [retryModalOpen, setRetryModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingRetryItem, setPendingRetryItem] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

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
      setRetryModalOpen(false);
      setPendingRetryItem(null);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
      setRetryModalOpen(false);
      setPendingRetryItem(null);
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
      setApproveModalOpen(false);
      setRejectModalOpen(false);
      setPendingApproveItem(null);
      setPendingRejectItem(null);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
      setApproveModalOpen(false);
      setRejectModalOpen(false);
      setPendingApproveItem(null);
      setPendingRejectItem(null);
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
      setApproveModalOpen(false);
      setRejectModalOpen(false);
      setPendingApproveItem(null);
      setPendingRejectItem(null);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
      setApproveModalOpen(false);
      setRejectModalOpen(false);
      setPendingApproveItem(null);
      setPendingRejectItem(null);
    },
  });

  const withdrawRequestMutation = useMutation({
    mutationFn: withdrawRequestToJoinUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listRequestsByUserId, activeTab.id],
      });
      toast.success("Request withdrawn successfully");
      setDeleteModalOpen(false);
      setPendingDeleteId(null);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong while withdrawing request.",
      );
      setDeleteModalOpen(false);
      setPendingDeleteId(null);
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

  // Handlers for My Request tab modals
  const handleRetryClick = useCallback((item) => {
    setPendingRetryItem(item);
    setRetryModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setPendingDeleteId(id);
    setDeleteModalOpen(true);
  }, []);

  const handleRetryConfirm = useCallback(() => {
    if (!pendingRetryItem?.id || newJoinRequestMutation.isPending) return;
    newJoinRequestMutation.mutate({
      ...buildRetryPayload(pendingRetryItem),
      actionType: "retry",
    });
  }, [pendingRetryItem, newJoinRequestMutation]);

  const handleDeleteConfirm = useCallback(() => {
    if (!pendingDeleteId || withdrawRequestMutation.isPending) return;
    withdrawRequestMutation.mutate({ requestId: pendingDeleteId });
  }, [pendingDeleteId, withdrawRequestMutation]);

  // Handlers for Pending tab modals
  const handleApproveClick = useCallback((item) => {
    setPendingApproveItem(item);
    setApproveModalOpen(true);
  }, []);

  const handleRejectClick = useCallback((item) => {
    setPendingRejectItem(item);
    setRejectModalOpen(true);
  }, []);

  const handleApproveConfirm = useCallback(() => {
    const item = pendingApproveItem;
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
  }, [pendingApproveItem, processingId, processJoinRequestMutation, processLeaveRequestMutation]);

  const handleRejectConfirm = useCallback(() => {
    const item = pendingRejectItem;
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
  }, [pendingRejectItem, processingId, processJoinRequestMutation, processLeaveRequestMutation]);

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
          onRetryClick={handleRetryClick}
          onDeleteClick={handleDeleteClick}
          newJoinRequestMutation={newJoinRequestMutation}
          withdrawRequestMutation={withdrawRequestMutation}
        />
      ) : (
        <RequestListTable
          data={data}
          isRequestPending={isRequestPending}
          activeTab={activeTab.id}
          onApproveClick={handleApproveClick}
          onRejectClick={handleRejectClick}
          processJoinRequestMutation={processJoinRequestMutation}
          processLeaveRequestMutation={processLeaveRequestMutation}
        />
      )}

      {/* Modals for Pending Tab (Approve/Reject) */}
      <ConfirmDeleteModal
        open={approveModalOpen}
        onClose={() => {
          setApproveModalOpen(false);
          setPendingApproveItem(null);
        }}
        onConfirm={handleApproveConfirm}
        title="Approve Request?"
        description="Are you sure you want to approve this request?"
        confirmText="Approve"
        loadingText="Approving..."
        isLoading={processJoinRequestMutation?.isPending || processLeaveRequestMutation?.isPending}
      />

      <ConfirmDeleteModal
        open={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setPendingRejectItem(null);
        }}
        onConfirm={handleRejectConfirm}
        title="Reject Request?"
        description="Are you sure you want to reject this request? This action cannot be undone."
        confirmText="Reject"
        loadingText="Rejecting..."
        isLoading={processJoinRequestMutation?.isPending || processLeaveRequestMutation?.isPending}
      />

      {/* Modals for My Request Tab (Retry/Delete) */}
      <ConfirmDeleteModal
        open={retryModalOpen}
        onClose={() => {
          setRetryModalOpen(false);
          setPendingRetryItem(null);
        }}
        onConfirm={handleRetryConfirm}
        title="Retry Request?"
        description="Are you sure you want to retry this request?"
        confirmText="Retry"
        loadingText="Retrying..."
        isLoading={newJoinRequestMutation.isPending}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Withdraw Request?"
        description="Are you sure you want to withdraw this request? This action cannot be undone."
        confirmText="Withdraw"
        loadingText="Withdrawing..."
        isLoading={withdrawRequestMutation.isPending}
      />
    </div>
  );
}
