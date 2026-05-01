import { getFormattedDateTime, queryKeys } from "@/utils";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listRequestByUserId,
  processLeaveRequestToJoinUser,
  processRequestToJoinUser,
} from "@/components/service/userAdmin";
import { CenterLoader } from "@/components/common/Loader";
import { useState, useMemo, useCallback } from "react";
import { Check, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { AgGridReact } from "ag-grid-react";
import ConfirmDeleteModal from "@/components/Modal/ConfirmDeleteModal";

const brokerTypes = [
  { name: "Pending", id: "pending" },
  { name: "Approved", id: "approved" },
  { name: "Rejected", id: "rejected" },
];

// ─── Cell Renderers ───────────────────────────────────────────────────────────

const SrNoRenderer = (props) => <span>{props.node.rowIndex + 1}</span>;

const NameRenderer = (props) => (
  <span>{props.data?.name?.toUpperCase()}</span>
);

const ActionRenderer = (props) => {
  const { onApproveClick, onRejectClick, disabled } = props;
  return (
    <div className="flex items-center gap-2 h-full">
      <Button
        className="p-2 rounded-md hover:bg-[#eef9ff] text-secondary bg-[#F5F0EC]"
        disabled={disabled}
        onClick={() => onApproveClick(props.data)}
      >
        <Check size={16} />
      </Button>
      <Button
        className="p-2 rounded-md hover:bg-[#eef9ff] text-[#FF645E] bg-[#F5F0EC]"
        disabled={disabled}
        onClick={() => onRejectClick(props.data)}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};

// ─── RequestListTable ─────────────────────────────────────────────────────────

const RequestListTable = ({
  data = [],
  isRequestPending,
  activeTab,
  onApproveClick,
  onRejectClick,
  onApproveConfirm,
  onRejectConfirm,
  processJoinRequestMutation,
  processLeaveRequestMutation,
  approveModalOpen,
  rejectModalOpen,
  setApproveModalOpen,
  setRejectModalOpen,
  pendingApproveItem,
  setPendingApproveItem,
  pendingRejectItem,
  setPendingRejectItem,
}) => {
  const showAction = activeTab === "pending";
  const isActionDisabled =
    processJoinRequestMutation?.isPending ||
    processLeaveRequestMutation?.isPending;

  const columnDefs = useMemo(() => {
    const cols = [
      {
        headerName: "Sr. No.",
        cellRenderer: SrNoRenderer,
        width: 120,
        minWidth: 120,
        maxWidth: 120,
        flex: 0,
        sortable: false,
      },
      {
        headerName: "Name",
        field: "name",
        cellRenderer: NameRenderer,
        flex: 1,
        minWidth: 160,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Email / Phone",
        field: "email",
        flex: 1,
        minWidth: 200,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Date (Received)",
        field: "updatedAt",
        valueGetter: (params) => getFormattedDateTime(params.data?.updatedAt),
        flex: 1,
        minWidth: 180,
      },
      {
        headerName: "Description",
        field: "requestMessage",
        flex: 2,
        minWidth: 200,
         wrapText: true,
        autoHeight: true,
      },
    ];

    if (showAction) {
      cols.push({
        headerName: "Action",
        field: "action",
        cellRenderer: ActionRenderer,
        cellRendererParams: {
          onApproveClick,
          onRejectClick,
          disabled: isActionDisabled,
        },
        flex: 1,
        minWidth: 120,
        sortable: false,
      });
    }

    return cols;
  }, [showAction, onApproveClick, onRejectClick, isActionDisabled]);

  return (
    <>
      <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
        <div className="bg-white !p-4 rounded-xl">
          {isRequestPending ? (
            <CenterLoader />
          ) : (
            <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
              {/* {data.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground font-medium text-lg border rounded-xl bg-gray-50/50">
                  No Records found.
                </div>
              ) : ( */}
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
              {/* )} */}
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={approveModalOpen}
        onClose={() => {
          setApproveModalOpen(false);
          setPendingApproveItem(null);
        }}
        onConfirm={onApproveConfirm}
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
        onConfirm={onRejectConfirm}
        title="Reject Request?"
        description="Are you sure you want to reject this request? This action cannot be undone."
        confirmText="Reject"
        loadingText="Rejecting..."
        isLoading={processJoinRequestMutation?.isPending || processLeaveRequestMutation?.isPending}
      />
    </>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Request() {
  const { userId } = useUserIdType();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(brokerTypes[0]);
  const [processingId, setProcessingId] = useState(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [pendingApproveItem, setPendingApproveItem] = useState(null);
  const [pendingRejectItem, setPendingRejectItem] = useState(null);

  const tabToApiParam = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
  };

  const { data: requestList = [], isPending: isRequestPending } = useQuery({
    queryKey: [queryKeys.listRequestsByUserId, activeTab.id],
    queryFn: () => listRequestByUserId(tabToApiParam[activeTab.id]),
    enabled: !!userId,
    keepPreviousData: true,
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

      <RequestListTable
        data={data}
        isRequestPending={isRequestPending}
        activeTab={activeTab.id}
        onApproveClick={handleApproveClick}
        onRejectClick={handleRejectClick}
        onApproveConfirm={handleApproveConfirm}
        onRejectConfirm={handleRejectConfirm}
        processJoinRequestMutation={processJoinRequestMutation}
        processLeaveRequestMutation={processLeaveRequestMutation}
        approveModalOpen={approveModalOpen}
        rejectModalOpen={rejectModalOpen}
        setApproveModalOpen={setApproveModalOpen}
        setRejectModalOpen={setRejectModalOpen}
        pendingApproveItem={pendingApproveItem}
        setPendingApproveItem={setPendingApproveItem}
        pendingRejectItem={pendingRejectItem}
        setPendingRejectItem={setPendingRejectItem}
      />
    </div>
  );
}