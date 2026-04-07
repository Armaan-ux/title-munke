import { getFormattedDateTime } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  addRequestToJoinUser,
  listRequestByUserId,
  withdrawRequestToJoinUser,
} from "@/components/service/userAdmin";
import { CenterLoader } from "@/components/common/Loader";
import { queryKeys } from "@/utils";
import { useState, useMemo, useCallback } from "react";
import { RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";

const agentTypes = [
  { name: "My Requests", id: "request" },
];

// ─── Cell Renderers ───────────────────────────────────────────────────────────

const SrNoRenderer = (props) => (
  <span className="font-medium">{props.node.rowIndex + 1}</span>
);

const BrokerNameRenderer = (props) => (
  <span className="whitespace-pre-wrap">
    {props.data?.toJoinName?.toUpperCase() || "N/A"}
  </span>
);

const StatusRenderer = (props) => {
  const status = props.data?.status;
  const styles =
    status === "Success" || status === "Completed" || status === "ACCEPTED"
      ? "bg-[#E9F3E9] text-[#1E8221]"
      : status === "Updated"
        ? "bg-[#eef9ff] text-[#2494C7]"
        : "bg-[#FFF3D9] text-[#A2781E]";

  return (
    <div className="flex items-center h-full">
      <Badge
        className={`${styles} text-[13px] font-medium px-3 py-1 rounded-md`}
      >
        {status}
      </Badge>
    </div>
  );
};

const ActionRenderer = (props) => {
  const { onRetry, onDelete, isRetryPending } = props;
  return (
    <div className="flex items-center gap-2 h-full">
      <button
        disabled={isRetryPending}
        className="p-2 rounded-md hover:bg-[#eef9ff] text-[#000000] bg-[#F5F0EC]"
        onClick={() => onRetry(props.data)}
      >
        <RefreshCcw size={16} />
      </button>
      <button
        className="p-2 rounded-md hover:bg-[#FFE3D9] text-[#FF0000] bg-[#F5F0EC]"
        onClick={() => onDelete(props.data?.id)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

// ─── RequestListTable ─────────────────────────────────────────────────────────

const RequestListTable = () => {
  const { userId, userType } = useUserIdType();
  const queryClient = useQueryClient();

  const { data: requestList, isPending: isRequestPending } = useQuery({
    queryKey: [queryKeys.listRequestsByUserId],
    queryFn: () => listRequestByUserId("myRequest"),
    skip: !userId,
  });

  const logs = requestList?.data || [];

  const newJoinRequestMutation = useMutation({
    mutationFn: addRequestToJoinUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([queryKeys.listRequestsByUserId]);
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

  const withdrawRequestMutation = useMutation({
    mutationFn: withdrawRequestToJoinUser,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.listRequestsByUserId]);
      toast.success("Request withdrawn successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong while withdrawing request.",
      );
    },
  });

  const buildRetryPayload = (item) => ({
    actionType: "retry",
    requestId: item?.id,
    userType: userType === "agent" ? "broker" : "",
    userId: item?.brokerId,
    ...(item?.requestMessage && { message: item.requestMessage }),
  });

  const handleRetry = useCallback(
    (item) => {
      if (!item?.id || newJoinRequestMutation.isPending) return;
      newJoinRequestMutation.mutate(buildRetryPayload(item));
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

  const columnDefs = useMemo(
    () => [
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
        headerName: "Broker Name",
        field: "toJoinName",
        cellRenderer: BrokerNameRenderer,
        flex: 1,
        minWidth: 180,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Date & Time",
        field: "updatedAt",
        valueGetter: (params) => getFormattedDateTime(params.data?.updatedAt),
        flex: 1,
        minWidth: 180,
      },
      {
        headerName: "Request Type",
        field: "requestType",
        flex: 1,
        minWidth: 140,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusRenderer,
        flex: 1,
        minWidth: 140,
         wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Action",
        field: "action",
        cellRenderer: ActionRenderer,
        cellRendererParams: {
          onRetry: handleRetry,
          onDelete: handleDelete,
          isRetryPending: newJoinRequestMutation.isPending,
        },
        flex: 1,
        minWidth: 120,
        sortable: false,
      },
    ],
    [handleRetry, handleDelete, newJoinRequestMutation.isPending],
  );

  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <div className="bg-white !p-4 rounded-xl">
        {isRequestPending ? (
          <CenterLoader />
        ) : (
          <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
        
              <AgGridReact
                rowData={logs}
                columnDefs={columnDefs}
                defaultColDef={{
                  flex: 1,
                  minWidth: 120,
                  filter: false,
                  sortable: true,
                  resizable: true,
                  unSortIcon: true,
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

export default function Requests() {
  const [activeTab, setActiveTab] = useState(agentTypes[0]);

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 mt-3 text-secondary">
      <div className="space-x-3 mb-4">
        {agentTypes.map((item) => (
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
      {activeTab.id === "request" && <RequestListTable />}
    </div>
  );
}