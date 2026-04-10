import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import AddUserModal from "@/components/Modal/AddUserModal";
import {
  reinviteAgent,
  getAgentsTotalSearches,
  deleteUser,
  CONSTANTS,
  undeleteUser,
  updateAgentStatus,
  getPendingAgentSearches,
  UnassignAgent,
  assignAgent,
  getTopPerformerAgent,
  getUnassignedAgents,
  reinviteUser,
  bulkAgentUpload,
} from "@/components/service/userAdmin";
import { useUser } from "@/context/usercontext";
import { fetchAgentsWithSearchCount } from "@/components/service/broker";
import { getFormattedDateTime, handleCreateAuditLog } from "@/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PencilLine,
  PlusCircle,
  Download,
  Upload,
  UserPlus,
  Eye,
  Trash2,
  ArchiveRestore,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AddAgentByBrokerModal from "@/components/Modal/AddAgentByBrokerModal";
import ConfirmDeleteModal from "@/components/Modal/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useRestoreUser } from "@/hooks/useRestoreUser";
import { useMutation } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { useUserIdType } from "@/hooks/useUserIdType";
import { AgGridReact } from "ag-grid-react";
import { CenterLoader } from "../common/Loader";

const agentTypes = [
  { name: "Agents", id: "agents" },
  { name: "Unassigned Agents", id: "unassigned-agents" },
];

export default function ManageAgents() {
  const [activeTab, setActiveTab] = useState(agentTypes[0]);
  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      <Agents />
    </div>
  );
}

// ─── Cell Renderers for Agents table ─────────────────────────────────────────

const SrNoRenderer = (props) => (
  <span className="font-medium">{props.node.rowIndex + 1}</span>
);

const AgentStatusRenderer = (props) => {
  const status = props.data?.status;
  const styles =
    status === "ACTIVE"
      ? "bg-[#E9F3E9] text-[#1E8221]"
      : status === "UNCONFIRMED"
        ? "bg-[#FFF3D9] text-[#A2781E]"
        : "bg-[#FFE3E2] text-[#FF5F59]";
  return (
    <div className="flex items-center h-full">
      <Badge className={`${styles} text-[13px] font-medium px-3 py-1 rounded-md`}>
        {status}
      </Badge>
    </div>
  );
};

const ReinviteRenderer = (props) => {
  const { reinviteMutation, setUserToReinvite, setIsReinviteDialogOpen } = props;
  if (props.data?.status !== "UNCONFIRMED") return null;
  return (
    <div className="flex items-center justify-center h-full">
      <UserPlus
        className="w-5 h-5 cursor-pointer"
        onClick={() => {
          setUserToReinvite(props.data);
          setIsReinviteDialogOpen(true);
        }}
      />
    </div>
  );
};

const AgentActionRenderer = (props) => {
  const { setAddAgent, setSelectedUser, navigate, restoreUserMutation, setUserToDelete, setIsDeleteDialogOpen } = props;
  const item = props.data;
  return (
    <div className="flex items-center justify-center gap-2 h-full">
      <Button
        size="icon"
        className="text-sm"
        variant="ghost"
        onClick={() => {
          setAddAgent(true);
          setSelectedUser(item);
        }}
      >
        <PencilLine />
      </Button>
      <Button
        size="icon"
        className="text-sm"
        variant="ghost"
        onClick={() =>
          navigate(`/broker/manage-agents/agent-property-details/${item?.id}`)
        }
      >
        <Eye />
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

// ─── Cell Renderers for UnassignedAgents table ────────────────────────────────

const AssignRenderer = (props) => {
  const { handleAssignAgent } = props;
  return (
    <div className="flex items-center h-full">
      <Button
        size="sm"
        className="text-sm"
        onClick={() => handleAssignAgent(props.data?.id, props.data?.name)}
      >
        Assign
      </Button>
    </div>
  );
};

const UnassignedDeleteRenderer = (props) => {
  const { handleUndeleteAgent, setUserToDelete, setIsDeleteDialogOpen } = props;
  const item = props.data;
  return (
    <div className="flex items-center h-full">
      {item?.status === CONSTANTS.USER_STATUS.DELETED ? (
        <Button
          className="text-sm"
          size="sm"
          onClick={() => handleUndeleteAgent(item.id, item.name, item.email)}
        >
          Undelete
        </Button>
      ) : (
        <Button
          className="text-sm"
          size="sm"
          variant="destructive"
          onClick={() => {
            setUserToDelete(item);
            setIsDeleteDialogOpen(true);
          }}
        >
          Delete
        </Button>
      )}
    </div>
  );
};

// ─── Agents ───────────────────────────────────────────────────────────────────

function Agents() {
  const navigate = useNavigate();
  const { user, brokerDetail } = useUser();
  const { userType } = useUserIdType();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [reinvitingAgentId, setReinvitingAgentId] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [pendingSearch, setPendingSearch] = useState(0);
  const [topPerformer, setTopPerformer] = useState("");
  const [addAgent, setAddAgent] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isReinviteDialogOpen, setIsReinviteDialogOpen] = useState(false);
  const [userToReinvite, setUserToReinvite] = useState(null);
  const underOrganisation = brokerDetail?.isUnderOrganisation;

  const bulkUploadMutation = useMutation({
    mutationFn: (data) => bulkAgentUpload(data),
    onSuccess: async () => {
      toast("Agents added successfully");
      if (fileInputRef?.current?.value) fileInputRef.current.value = "";
      fetchData();
      await handleCreateAuditLog(
        "Bulk Upload",
        { detail: "Bulk Agent Upload" },
        false,
        userType,
      );
    },
    onError: (err) => {
      toast(err?.response?.data?.message);
      if (fileInputRef?.current?.value) fileInputRef.current.value = "";
    },
  });

  const fetchData = useCallback(async () => {
    if (user?.attributes?.sub) {
      setLoading(true);
      try {
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);
        const nextMonthStart = new Date(currentMonthStart);
        nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

        const [totalSearches, agents, pendingSearches, topPerformerObj] =
          await Promise.all([
            getAgentsTotalSearches(
              user.attributes.sub,
              currentMonthStart.toISOString(),
              nextMonthStart.toISOString(),
            ),
            fetchAgentsWithSearchCount(user.attributes.sub),
            getPendingAgentSearches(user.attributes.sub),
            getTopPerformerAgent(user.attributes.sub),
          ]);

        const performer = topPerformerObj?.topPerformer;
        setTopPerformer(
          performer
            ? `${performer.agentName || "None"} (${performer.searchCount || 0})`
            : "No Top Performer",
        );
        setAgents(agents);
        setPendingSearch(pendingSearches.pendingSearches);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  const [selectedUser, setSelectedUser] = useState({});
  const { deleteUserMutation } = useDeleteUser(fetchData);
  const { restoreUserMutation } = useRestoreUser(fetchData);

  const reinviteMutation = useMutation({
    mutationFn: (payload) => reinviteUser(payload),
    onSuccess: () => toast.success("Reinvitation sent successfully"),
  });

  useEffect(() => {
    if (user?.attributes?.sub) {
      fetchData();
      const interval = setInterval(fetchData, 1800000);
      return () => clearInterval(interval);
    }
  }, [user, fetchData]);

  useEffect(() => {
    if (agents) {
      setFilteredAgents(agents);
    }
  }, [agents, showDeleted]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: null });
      bulkUploadMutation.mutate({ agents: json, brokerId: user.attributes.sub });
    };
    reader.readAsArrayBuffer(file);
    setProfileImage(file);
  };

  // Filter row data externally so AG Grid re-renders on statusFilter change
  const rowData = useMemo(
    () =>
      agents?.filter(
        (item) => statusFilter === "ALL" || item.status === statusFilter,
      ) ?? [],
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
        sortable: false,
      },
      {
        headerName: "Agent Name",
        field: "agentName",
        valueGetter: (params) => params.data?.agentName || "-",
        flex: 1,
        minWidth: 160,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Searches This Month",
        field: "totalSearches",
        flex: 1,
        width: 120,
        minWidth: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",

      },
      {
        headerName: "Last Login",
        field: "lastLogin",
        valueGetter: (params) =>
          params.data?.lastLogin
            ? getFormattedDateTime(params.data.lastLogin)
            : "-",
        flex: 1,
        minWidth: 180,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: AgentStatusRenderer,
        flex: 1,
        minWidth: 160,
      },
      {
        headerName: "Reinvite",
        field: "reinvite",
        cellRenderer: ReinviteRenderer,
        cellRendererParams: { reinviteMutation, setUserToReinvite, setIsReinviteDialogOpen },
        flex: 0.7,
        minWidth: 140,
        width: 140,
        sortable: false,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
      {
        headerName: "Action",
        field: "action",
        cellRenderer: AgentActionRenderer,
        cellRendererParams: {
          setAddAgent,
          setSelectedUser,
          navigate,
          restoreUserMutation,
          setUserToDelete,
          setIsDeleteDialogOpen,
        },
        flex: 0.8,
        minWidth: 140,
        width: 140,
        sortable: false,
        cellStyle: { textAlign: "center" },
        headerClass: "ag-header-cell-center",
      },
    ],
    [reinviteMutation, navigate, restoreUserMutation],
  );

  return (
    <>
      <AddUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userType="agent"
        setUser={setAgents}
        agents={agents}
      />
      {addAgent && (
        <AddAgentByBrokerModal
          open={addAgent}
          onOpenChange={() => {
            setAddAgent(false);
            setSelectedUser({});
          }}
          setUser={setAgents}
          selectedUser={selectedUser}
          invalidateFun={fetchData}
        />
      )}

      <div className="bg-white !p-4 rounded-xl">
        {brokerDetail?.planType === "EXPLORE_PLAN" ? (
          <div className="py-20 text-center border-2 border-dashed rounded-xl bg-gray-100/50">
            <p className="text-lg font-medium text-muted-foreground italic">
              Upgrade your plan to access this feature.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between gap-4 items-center mb-4 flex-wrap">
              <div className="flex items-center gap-4">
                <p className="text-lg font-medium">All Agents</p>
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

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                <a
                  href={
                    underOrganisation ||
                      brokerDetail?.planType === "EXPLORE_PLAN"
                      ? undefined
                      : "https://title-search-storage.s3.us-east-1.amazonaws.com/Bulk+Upload+Template.xlsx"
                  }
                >
                  <Button
                    variant="outline"
                    disabled={
                      underOrganisation ||
                      brokerDetail?.planType === "EXPLORE_PLAN"
                    }
                    className="h-[36px] border border-[#4C0D0D] text-[#4C0D0D] text-[13px] font-medium rounded-md hover:bg-[#4C0D0D]/5 flex items-center gap-1.5 px-3"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </Button>
                </a>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".xls,.xlsx"
                />
                <Button
                  disabled={
                    underOrganisation ||
                    bulkUploadMutation.isPending ||
                    brokerDetail?.planType === "EXPLORE_PLAN"
                  }
                  variant="outline"
                  className="h-[36px] border border-[#4C0D0D] text-[#4C0D0D] text-[13px] font-medium rounded-md hover:bg-[#4C0D0D]/5 flex items-center gap-1.5 px-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Upload Template
                </Button>
                <Button
                  onClick={() => setAddAgent(true)}
                  disabled={
                    underOrganisation ||
                    brokerDetail?.planType === "EXPLORE_PLAN"
                  }
                  className="h-[36px] bg-[#4C0D0D] hover:bg-[#4C0D0D]/90 text-white text-[13px] font-medium rounded-md flex items-center gap-1.5 px-3"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Agent
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground font-medium text-lg">
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
                    wrapHeaderText: true,
                    autoHeaderHeight: true,
                  }}
                  rowHeight={72}
                  headerHeight={48}
                  domLayout="autoHeight"
                  animateRows={true}
                  enableCellTextSelection={true}
                  ensureDomOrder={true}
                  suppressCellFocus={true}
                  overlayNoRowsTemplate='<span class="text-muted-foreground font-medium text-lg">No Records found.</span>'
                />

              </div>
            )}
          </>
        )}
      </div>
      <ConfirmDeleteModal
        open={isReinviteDialogOpen}
        onClose={() => setIsReinviteDialogOpen(false)}
        onConfirm={() => {
          if (userToReinvite) {
            reinviteMutation.mutate({ email: userToReinvite.email }, {
              onSettled: () => setIsReinviteDialogOpen(false)
            });
          }
        }}
        isLoading={reinviteMutation?.isPending}
        title="Reinvite Agent"
        description={`Are you sure you want to send a reinvitation email to ${userToReinvite?.name || userToReinvite?.agentName || "this agent"}?`}
        confirmText="Reinvite"
        loadingText="Sending..."
      />
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
        description={`Are you sure you want to delete ${userToDelete?.agentName || "this agent"}? This action cannot be undone.`}
      />
    </>
  );
}

// ─── UnassignedAgents ─────────────────────────────────────────────────────────

function UnassignedAgents() {
  const { user, brokerDetail } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [agents, setAgents] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [filteredAgents, setFilteredAgents] = useState([]);

  const handleAssignAgent = useCallback(async (id, name) => {
    const result = await assignAgent(id, name, user?.attributes?.sub);
    if (result) {
      setAgents((prev) => prev.filter((elem) => elem.id !== id));
      toast.success("Agent Assigned Successfully.");
      handleCreateAuditLog("ASSIGN", { detail: `Assigned Agent ${id}` });
    }
  }, [user]);

  const handleUndeleteAgent = useCallback(async (id, name, email) => {
    if (window.confirm(`Are you sure you want to restore agent: ${name}?`)) {
      const result = await undeleteUser(id, email, CONSTANTS.USER_TYPES.AGENT);
      if (result) {
        setAgents((prev) =>
          prev.map((agent) =>
            agent.id === id ? { ...agent, status: result.status } : agent,
          ),
        );
        toast.success("Agent Restored Successfully.");
        handleCreateAuditLog("RESTORE", { detail: `Restored Agent ${name} (${id})` });
      }
    }
  }, []);

  useEffect(() => {
    const fetchNotAssignedAgents = async () => {
      try {
        setIsLoading(true);
        const items = await getUnassignedAgents();
        setAgents(items);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotAssignedAgents();
  }, []);

  useEffect(() => {
    if (agents) {
      const filtered = showDeleted
        ? agents
        : agents.filter((agent) => agent.status !== "DELETED");
      setFilteredAgents(filtered);
    }
  }, [agents, showDeleted]);

  const rowData = useMemo(
    () =>
      agents?.filter(
        (item) => statusFilter === "ALL" || item.status === statusFilter,
      ) ?? [],
    [agents, statusFilter],
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Sr. No.",
        cellRenderer: SrNoRenderer,
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        flex: 0,
        filter: false,
        sortable: false,
      },
      {
        headerName: "Name",
        field: "name",
        flex: 1,
        minWidth: 160,
        filter: false,
        wrapText: true,
        autoHeight: true,
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
        flex: 1,
        minWidth: 160,
        filter: false,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Assign",
        field: "assign",
        cellRenderer: AssignRenderer,
        cellRendererParams: { handleAssignAgent },
        flex: 1,
        minWidth: 140,
        filter: false,
        sortable: false,
        wrapText: true,
        autoHeight: true,
      },
      {
        headerName: "Delete",
        field: "delete",
        cellRenderer: UnassignedDeleteRenderer,
        cellRendererParams: { handleUndeleteAgent, setUserToDelete, setIsDeleteDialogOpen },
        flex: 1,
        minWidth: 140,
        filter: false,
        sortable: false,
      },
    ],
    [handleAssignAgent, handleUndeleteAgent],
  );

  return (
    <>
      <div className="bg-white !p-4 rounded-xl">
        {brokerDetail?.planType === "EXPLORE_PLAN" ? (
          <div className="py-20 text-center border-2 border-dashed rounded-xl bg-gray-100/50">
            <p className="text-lg font-medium text-muted-foreground italic">
              Upgrade your plan to access this feature.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 justify-end mb-3">
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

            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground font-medium text-lg">
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
          </>
        )}
      </div>

      <ConfirmDeleteModal
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={async () => {
          if (userToDelete) {
            const result = await deleteUser(
              userToDelete.id,
              userToDelete.email,
              CONSTANTS.USER_TYPES.AGENT,
            );
            if (result) {
              setAgents((prev) =>
                prev.map((agent) =>
                  agent.id === userToDelete.id
                    ? { ...agent, status: result.status }
                    : agent,
                ),
              );
              toast.success("Agent Deleted Successfully.");
              handleCreateAuditLog("DELETE", {
                detail: `Deleted Agent ${userToDelete.name} (${userToDelete.id})`,
              });
              setIsDeleteDialogOpen(false);
            }
          }
        }}
        title="Delete Agent"
        description={`Are you sure you want to delete ${userToDelete?.name || "this agent"}? This action cannot be undone.`}
      />
    </>
  );
}