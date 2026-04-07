import { useEffect, useMemo, useState } from "react";
import { fetchAgentsWithSearchCount } from "@/components/service/broker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useRestoreUser } from "@/hooks/useRestoreUser";
import { useMutation } from "@tanstack/react-query";
import {
  ArchiveRestore,
  PencilLine,
  PlusCircle,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import { toast } from "react-toastify";
import AddAdminModal from "../Modal/AddAdminModal";
import {
  CONSTANTS,
  deleteUser,
  getActiveBrokers,
  getOrgAgentsList,
  getOrgBrokersList,
  getTotalBrokers,
  getTotalBrokerSearchesThisMonth,
  reinviteUser,
  updateBrokerStatus,
} from "../service/userAdmin";
import { Badge } from "../ui/badge";
import { handleCreateAuditLog } from "@/utils";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useUser } from "@/context/usercontext";
import BulkUploadModal from "../Modal/BulkUploadModal";
import ConfirmDeleteModal from "../Modal/ConfirmDeleteModal";
import { AgGridReact } from "ag-grid-react";
import { CenterLoader } from "../common/Loader";

const userTypes = [
  { name: "Broker", id: "broker" },
  { name: "Agent", id: "agent" },
];

export default function Users() {
  const [activeTab, setActiveTab] = useState(userTypes[0]);
  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      <div className="space-x-3 mb-4">
        {userTypes.map((item) => (
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
      {activeTab.id === "broker" && <AdminBrokersList />}
      {activeTab.id === "agent" && <Agents />}
    </div>
  );
}

// ─── Shared Cell Renderers ────────────────────────────────────────────────────

const SrNoRenderer = (props) => (
  <span className="font-medium">{props.node.rowIndex + 1}</span>
);

const StatusBadgeRenderer = (props) => {
  const status = props.data?.status;
  const styles =
    status === "ACTIVE"
      ? "bg-[#E9F3E9] text-[#1E8221]"
      : status === "DELETED"
        ? "text-destructive/80 bg-destructive/20"
        : "bg-[#FFF3D9] text-[#A2781E]";
  return (
    <div className="flex items-center h-full">
      <Badge className={`${styles} text-[13px] font-medium px-3 py-1 rounded-full`}>
        {status}
      </Badge>
    </div>
  );
};

// ─── AdminBrokersList ─────────────────────────────────────────────────────────

const BrokerActionRenderer = (props) => {
  const { setSelectedBroker, setIsOpen, restoreUserMutation, setUserToDelete, setIsDeleteDialogOpen } = props;
  const item = props.data;
  return (
    <div className="flex items-center gap-2 h-full">
      <Button
        size="icon"
        className="text-md"
        variant="ghost"
        onClick={() => {
          setSelectedBroker(item);
          setIsOpen(true);
        }}
      >
        <PencilLine />
      </Button>
      <Button
        size="icon"
        className="text-md"
        variant="ghost"
        onClick={() => {
          if (item?.status === "DELETED") {
            restoreUserMutation.mutate({
              userId: item.id,
              email: item.email,
              userType: "broker",
            });
          } else {
            setUserToDelete(item);
            setIsDeleteDialogOpen(true);
          }
        }}
      >
        {item?.status === "DELETED" ? <ArchiveRestore /> : <Trash2 />}
      </Button>
    </div>
  );
};

function AdminBrokersList() {
  const [isBrokerListLoading, setIsBrokerListLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState({});
  const { user, organisationDetail } = useUser();
  const { userType } = useUserIdType();
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [brokers, setBrokers] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [totalBrokerCount, setTotalBrokerCount] = useState(0);
  const [totalActiveBrokerCount, setTotalActiveBrokerCount] = useState(0);
  const [totalBrokerSearchThisMonthCount, setTotalBrokerSearchThisMonthCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const { deleteUserMutation } = useDeleteUser(() => {
    handleFetchBrokersWithSearchCount(true);
    setHasMore(true);
  });
  const { restoreUserMutation } = useRestoreUser(() => {
    handleFetchBrokersWithSearchCount(true);
    setHasMore(true);
  });

  const getBroker = async () => {
    try {
      setLoading(true);
      const totalBrokerDict = await getTotalBrokers();
      const ActiveBrokers = await getActiveBrokers();
      const TotalBrokerSearchesThisMonthDict = await getTotalBrokerSearchesThisMonth();
      setTotalBrokerSearchThisMonthCount(TotalBrokerSearchesThisMonthDict.totalSearches);
      setTotalBrokerCount(totalBrokerDict?.totalBrokers);
      setTotalActiveBrokerCount(ActiveBrokers?.length);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBroker();
    const interval = setInterval(getBroker, 1800000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleFetchBrokersWithSearchCount();
  }, []);

  const handleFetchBrokersWithSearchCount = async (isRefetch) => {
    setIsBrokerListLoading(true);
    try {
      const response = await getOrgBrokersList({
        nextToken: isRefetch ? null : nextToken,
        limit: 10,
      });
      const { items: updatedBrokers, nextToken: newNextToken } = response;
      setBrokers((prev) => (isRefetch ? updatedBrokers : [...prev, ...updatedBrokers]));
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
    } catch (error) {
      console.error("Error fetching broker list:", error);
    }
    setIsBrokerListLoading(false);
  };

  const rowData = useMemo(
    () => brokers.filter((item) => statusFilter === "ALL" || item.status === statusFilter),
    [brokers, statusFilter],
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
        filter: false,
        sortable: false,
      },
      {
        headerName: "Name",
        field: "name",
        valueGetter: (params) => params.data?.name,
        flex: 1,
        minWidth: 180,
        filter: false,
        cellStyle: { fontWeight: 500, color: "black" },
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1,
        minWidth: 200,
        filter: false,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Team Strength",
        field: "teamStrength",
        valueGetter: (params) => params.data?.teamStrength || "-",
        flex: 1,
        minWidth: 140,
        filter: false,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusBadgeRenderer,
        flex: 1,
        minWidth: 160,
        filter: false,
      },
      {
        headerName: "Action",
        field: "action",
        cellRenderer: BrokerActionRenderer,
        cellRendererParams: {
          setSelectedBroker,
          setIsOpen,
          restoreUserMutation,
          setUserToDelete,
          setIsDeleteDialogOpen,
        },
        flex: 1,
        minWidth: 140,
        filter: false,
        sortable: false,
      },
    ],
    [restoreUserMutation],
  );

  return (
    <>
      {isOpen && (
        <AddAdminModal
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedBroker({});
          }}
          title="Broker"
          userType="broker"
          invalidateFun={() => {
            handleFetchBrokersWithSearchCount(true);
            setHasMore(true);
          }}
          selectedUser={selectedBroker}
        />
      )}

      <div className="bg-white !p-4 rounded-xl">
        {organisationDetail?.planType === "EXPLORE_PLAN" ? (
          <div className="py-20 text-center border-2 border-dashed rounded-xl bg-gray-50/50">
            <p className="text-lg font-medium text-muted-foreground">
              Upgrade your plan to access this feature.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between gap-4 items-center mb-4">
              <div className="flex items-center gap-4">
                <p className="text-lg font-medium">All Brokers</p>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="UNCONFIRMED">Unconfirmed</SelectItem>
                    <SelectItem value="DELETED">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-[36px] border border-[#4C0D0D] text-[#4C0D0D] text-[13px] font-medium rounded-md hover:bg-[#4C0D0D]/5 flex items-center gap-1.5 px-3"
                  onClick={() => setIsBulkUploadOpen(true)}
                >
                  <Upload className="w-4 h-4" />
                  Upload Template
                </Button>
                <BulkUploadModal
                  open={isBulkUploadOpen}
                  onClose={() => setIsBulkUploadOpen(false)}
                  type="broker"
                  onSuccess={() => {
                    getBroker();
                    handleFetchBrokersWithSearchCount(true);
                  }}
                />
                <Button variant="secondary" onClick={() => setIsOpen(true)}>
                  <PlusCircle /> Add Broker
                </Button>
              </div>
            </div>

            {isBrokerListLoading && rowData.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground font-medium">
                    <CenterLoader />
              </div>
            ) : (
              <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
            
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={{
                      flex: 1,
                      minWidth: 120,
                      filter: true,
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

            <div className="text-center flex flex-col gap-4 my-4 text-muted-foreground">
              {isBrokerListLoading && rowData.length > 0 && <p>Loading...</p>}
              {!hasMore && brokers?.length !== 0 && <p>No more data to load.</p>}
              {brokers?.length > 0 && hasMore && !isBrokerListLoading && (
                <Button size="sm" onClick={() => handleFetchBrokersWithSearchCount()}>
                  Load More
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmDeleteModal
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUserMutation.mutate({
              userId: userToDelete.id,
              email: userToDelete.email,
              userType: "broker",
            });
            setIsDeleteDialogOpen(false);
          }
        }}
        isLoading={deleteUserMutation?.isPending}
        title="Delete Broker"
        description={`Are you sure you want to delete ${userToDelete?.name || "this broker"}? This action cannot be undone.`}
      />
    </>
  );
}

// ─── Agents ───────────────────────────────────────────────────────────────────

const AgentReinviteRenderer = (props) => {
  const { reinviteMutation } = props;
  if (props.data?.status !== "UNCONFIRMED") return null;
  return (
    <div className="flex items-center justify-center h-full">
      <Button
        size="icon"
        className="text-md"
        variant="ghost"
        onClick={() => reinviteMutation.mutate({ email: props.data?.email })}
        disabled={reinviteMutation.isPending}
      >
        <UserPlus />
      </Button>
    </div>
  );
};

const AgentActionRenderer = (props) => {
  const { setSelectedUser, setIsOpen, restoreUserMutation, setUserToDelete, setIsDeleteDialogOpen } = props;
  const item = props.data;
  return (
    <div className="flex items-center gap-2 h-full">
      <Button
        size="icon"
        className="text-md"
        variant="ghost"
        onClick={() => {
          setSelectedUser(item);
          setIsOpen(true);
        }}
      >
        <PencilLine />
      </Button>
      <Button
        size="icon"
        className="text-md"
        variant="ghost"
        onClick={() => {
          if (item?.status === "DELETED") {
            restoreUserMutation.mutate({
              userId: item.id,
              email: item.email,
              userType: "agent",
            });
          } else {
            setUserToDelete(item);
            setIsDeleteDialogOpen(true);
          }
        }}
      >
        {item?.status === "DELETED" ? <ArchiveRestore /> : <Trash2 />}
      </Button>
    </div>
  );
};

function Agents() {
  const [isOpen, setIsOpen] = useState(false);
  const { organisationDetail } = useUser();
  const [agents, setAgents] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isAgentListLoading, setIsAgentListLoading] = useState(false);
  const [nextToken, setNextToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const { deleteUserMutation } = useDeleteUser(() => {
    handleFetchAgentListing(true);
    setHasMore(true);
  });
  const { restoreUserMutation } = useRestoreUser(() => {
    handleFetchAgentListing(true);
    setHasMore(true);
  });
  const reinviteMutation = useMutation({
    mutationFn: (payload) => reinviteUser(payload),
    onSuccess: () => {
      toast.success("Reinvitation sent successfully");
      handleFetchAgentListing(true);
      setHasMore(true);
    },
  });

  useEffect(() => {
    handleFetchAgentListing();
  }, []);

  const handleFetchAgentListing = async (isRefetch) => {
    setIsAgentListLoading(true);
    try {
      const response = await getOrgAgentsList({
        nextToken: isRefetch ? null : nextToken,
        limit: 10,
      });
      const { items, nextToken: newNextToken } = response;
      setAgents((prev) => (isRefetch ? items : [...prev, ...items]));
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
    } catch (error) {
      console.error("Error fetching agent listings:", error);
    }
    setIsAgentListLoading(false);
  };

  const rowData = useMemo(
    () => agents.filter((item) => statusFilter === "ALL" || item.status === statusFilter),
    [agents, statusFilter],
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
        filter: false,
        sortable: false,
      },
      {
        headerName: "Name",
        field: "name",
        flex: 1,
        minWidth: 180,
        filter: false,
        cellStyle: { fontWeight: 500, color: "black" },
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1,
        minWidth: 200,
        filter: false,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusBadgeRenderer,
        flex: 1,
        minWidth: 160,
        filter: false,
      },
      {
        headerName: "Reinvite",
        field: "reinvite",
        cellRenderer: AgentReinviteRenderer,
        cellRendererParams: { reinviteMutation },
        flex: 1,
        minWidth: 140,
        filter: false,
        sortable: false,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
      {
        headerName: "Action",
        field: "action",
        cellRenderer: AgentActionRenderer,
        cellRendererParams: {
          setSelectedUser,
          setIsOpen,
          restoreUserMutation,
          setUserToDelete,
          setIsDeleteDialogOpen,
        },
        flex: 1,
        minWidth: 140,
        filter: false,
        sortable: false,
      },
    ],
    [reinviteMutation, restoreUserMutation],
  );

  const loading = deleteUserMutation.isPending || restoreUserMutation.isPending;

  return (
    <>
      {isOpen && (
        <AddAdminModal
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedUser({});
          }}
          title="Agent"
          userType="agent"
          invalidateFun={() => {
            handleFetchAgentListing(true);
            setHasMore(true);
          }}
          selectedUser={selectedUser}
        />
      )}
      <div className="bg-white !p-4 rounded-xl">
        {organisationDetail?.planType === "EXPLORE_PLAN" ? (
          <div className="py-20 text-center border-2 border-dashed rounded-xl bg-gray-100/50">
            <p className="text-lg font-medium text-muted-foreground italic">
              Upgrade your plan to access this feature.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between gap-4 items-center mb-4">
              <div className="flex items-center gap-4">
                <p className="text-lg font-medium">All Agents</p>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="UNCONFIRMED">Unconfirmed</SelectItem>
                    <SelectItem value="DELETED">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-[36px] border border-[#4C0D0D] text-[#4C0D0D] text-[13px] font-medium rounded-md hover:bg-[#4C0D0D]/5 flex items-center gap-1.5 px-3"
                  onClick={() => setIsBulkUploadOpen(true)}
                  disabled={loading}
                >
                  <Upload className="w-4 h-4" />
                  Upload Template
                </Button>
                <BulkUploadModal
                  open={isBulkUploadOpen}
                  onClose={() => setIsBulkUploadOpen(false)}
                  type="agent"
                  onSuccess={() => handleFetchAgentListing(true)}
                />
                <Button variant="secondary" onClick={() => setIsOpen(true)}>
                  <PlusCircle /> Add Agent
                </Button>
              </div>
            </div>

            {isAgentListLoading && rowData.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground font-medium">
                <CenterLoader />
              </div>
            ) : (
              <div className="ag-theme-quartz custom-ag-grid" style={{ width: "100%" }}>
           
                  <AgGridReact
                    rowData={rowData}
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

            <div className="text-center flex flex-col gap-4 my-4 text-muted-foreground">
              {isAgentListLoading && rowData.length > 0 && <p>Loading...</p>}
              {!hasMore && !isAgentListLoading && agents?.length !== 0 && (
                <p>No more data to load.</p>
              )}
              {agents?.length > 0 && hasMore && !isAgentListLoading && (
                <Button size="sm" onClick={handleFetchAgentListing}>
                  Load More
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmDeleteModal
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUserMutation.mutate({
              userId: userToDelete.id,
              email: userToDelete.email,
              userType: "agent",
            });
            setIsDeleteDialogOpen(false);
          }
        }}
        isLoading={deleteUserMutation?.isPending}
        title="Delete Agent"
        description={`Are you sure you want to delete ${userToDelete?.name || "this agent"}? This action cannot be undone.`}
      />
    </>
  );
}