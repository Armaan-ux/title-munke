import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  PencilLine,
  Plus,
  PlusCircle,
  Search,
  Download,
  Upload,
  UserPlus,
  Eye,
  Trash2,
  ArchiveRestore,
} from "lucide-react";
import { API } from "aws-amplify";
import { listAgents } from "@/graphql/queries";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import AddAgentByBrokerModal from "@/components/Modal/AddAgentByBrokerModal";
import { useNavigate } from "react-router-dom";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useRestoreUser } from "@/hooks/useRestoreUser";
import { useMutation } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { useUserIdType } from "@/hooks/useUserIdType";

const agentTypes = [
  {
    name: "Agents",
    id: "agents",
  },
  {
    name: "Unassigned Agents",
    id: "unassigned-agents",
  },
  // {
  //     name: "Agent",
  //     id: "agent"
  // }
];

export default function ManageAgents() {
  const [activeTab, setActiveTab] = useState(agentTypes[0]);
  return (
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      {/* <div className="space-x-3 mb-4">
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
      </div> */}

      {/* {activeTab.id === "agents" && <Agents />}
      {activeTab.id === "unassigned-agents" && <UnassignedAgents />} */}

      <Agents />
    </div>
  );
}

function Agents() {
  const navigate = useNavigate();
  const { user, brokerDetail } = useUser();
  const { userType } = useUserIdType();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [totalSearchesThisMonth, setTotalSearchesThisMonth] = useState(0);
  const [reinvitingAgentId, setReinvitingAgentId] = useState(null);
  const [deletingAgentId, setDeletingAgentId] = useState(null);
  const [undeletingAgentId, setUndeletingAgentId] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [pendingSearch, setPendingSearch] = useState(0);
  const [topPerformer, setTopPerformer] = useState("");
  const [addAgent, setAddAgent] = useState(false);
  const underOrganisation = brokerDetail?.isUnderOrganisation;
  const bulkUploadMutation = useMutation({
    mutationFn: (data) => bulkAgentUpload(data),
    onSuccess: async () => {
      toast("Agents added successfully");
      if (fileInputRef?.current?.value) {
        fileInputRef.current.value = "";
      }
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
      if (fileInputRef?.current?.value) {
        fileInputRef.current.value = "";
      }
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

        let topPerformerText = "No Top Performer";
        const performer = topPerformerObj?.topPerformer;

        if (performer) {
          topPerformerText = `${performer.agentName || "None"} (${
            performer.searchCount || 0
          })`;
        }
        setTotalSearchesThisMonth(totalSearches.totalSearches);
        setAgents(agents);
        setPendingSearch(pendingSearches.pendingSearches);
        setTopPerformer(topPerformerText);
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
    onSuccess: () => {
      toast.success("Reinvitation sent successfully");
    },
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
      const filtered = showDeleted
        ? agents
        : agents.filter(
            (agent) => agent.status !== CONSTANTS.USER_STATUS.DELETED,
          );
      setFilteredAgents(agents);
    }
  }, [agents, showDeleted]);

  const unAssignAgent = async (agentId) => {
    const result = await UnassignAgent(agentId);
    if (result) {
      setAgents((prevAgents) =>
        prevAgents.filter((elem) => elem.agentId !== agentId),
      );
      toast.success("Agent UnAssigned Successfully.");
      handleCreateAuditLog("UNASSIGN", {
        detail: `Unassigned Agent ${agentId}`,
      });
    }
  };

  const toggleAgentStatus = async (id, status) => {
    const result = await updateAgentStatus(id, status);
    if (result) {
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.agentId === id ? { ...agent, status: status } : agent,
        ),
      );
      toast.success(`Agent ${status} Successfully.`);
      handleCreateAuditLog("ACTIVE_STATUS", {
        detail: `Convert Agent ${id} Status to ${status}`,
      });
    }
  };

  const handleReinvite = async (agent) => {
    setReinvitingAgentId(agent.id);
    const result = await reinviteAgent(agent);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error || "Failed to reinvite agent.");
    }
    setReinvitingAgentId(null);
  };

  const handleDelete = async (agent) => {
    if (
      window.confirm(
        `Are you sure you want to delete agent ${agent.agentName}? This is a soft delete.`,
      )
    ) {
      setDeletingAgentId(agent.id);
      try {
        await deleteUser(agent.id, agent.email, CONSTANTS.USER_TYPES.AGENT);
        toast.success(`Agent ${agent.agentName} has been deleted.`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete agent:", error);
        toast.error(
          `Failed to delete agent. ${error?.response?.data?.message || ""}`,
        );
      } finally {
        setDeletingAgentId(null);
      }
    }
  };

  const handleUndelete = async (agent) => {
    if (
      window.confirm(
        `Are you sure you want to restore agent ${agent.agentName}?`,
      )
    ) {
      setUndeletingAgentId(agent.id);
      try {
        await undeleteUser(agent.id, agent.email, CONSTANTS.USER_TYPES.AGENT);
        toast.success(`Agent ${agent.agentName} has been restored.`);
        fetchData();
      } catch (error) {
        console.error("Failed to restore agent:", error);
        toast.error(
          `Failed to restore agent. ${error?.response?.data?.message || ""}`,
        );
      } finally {
        setUndeletingAgentId(null);
      }
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(worksheet, {
        defval: null,
      });
      console.log("json data:", json);
      bulkUploadMutation.mutate({
        agents: json,
        brokerId: user.attributes.sub,
      });
    };

    reader.readAsArrayBuffer(file);

    setProfileImage(file);
    // bulkUploadMutation.mutate(file)
  };
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
      {/* <div className="flex items-center gap-2 justify-end mb-3">
        <Checkbox
          id="show-deleted-checkbox"
          className="border-2 size-5 cursor-pointer bg-white"
          checked={showDeleted}
          onCheckedChange={(value) => setShowDeleted(value)}
        />
        <Label htmlFor="show-deleted-checkbox" className="text-sm mb-0">
          Show Deleted
        </Label>
      </div> */}
      <div className="w-full  flex flex-wrap items-center justify-between gap-3 mb-4 rounded-md">
        {/* Left Section */}
        <div className="flex items-center gap-5 w-full sm:w-auto">
          <p className="text-xl font-semibold text-[#4C0D0D] whitespace-nowrap">
            All Agents
          </p>
          <div className="relative w-full sm:w-[220px]">
            {/* <Input
              type="text"
              placeholder="Search"
              className="h-[40px] rounded-md pl-8 border border-[#E2DAD5] bg-white text-[#4C0D0D] placeholder:text-[#B6AAA5] focus-visible:ring-0 focus-visible:ring-offset-0"
            /> */}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-2.5 top-3 h-4 w-4 text-[#B6AAA5]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
              />
            </svg> */}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <a
            href={
              underOrganisation || brokerDetail?.planType === "EXPLORE_PLAN"
                ? undefined
                : "https://title-search-storage.s3.us-east-1.amazonaws.com/Bulk+Upload+Template.xlsx"
            }
          >
            <Button
              variant="outline"
              disabled={
                underOrganisation || brokerDetail?.planType === "EXPLORE_PLAN"
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
            // onClick={() => setAddAgent(user?.status === "active")}
            onClick={() => setAddAgent(true)}
            disabled={
              underOrganisation || brokerDetail?.planType === "EXPLORE_PLAN"
            }
            className="h-[36px] bg-[#4C0D0D] hover:bg-[#4C0D0D]/90 text-white text-[13px] font-medium rounded-md flex items-center gap-1.5 px-3"
            // disabled={user?.status !== "active"}
          >
            <PlusCircle className="w-4 h-4" />
            Add Agent
          </Button>
        </div>
      </div>
      <div className="bg-white !p-4 rounded-xl">
        <Table className="">
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead className="w-[100px]">Sr. No.</TableHead>
              <TableHead>Agent Name</TableHead>
              <TableHead className="text-center">
                Searchers This Month
              </TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Reinvite</TableHead>
              <TableHead className="text-center">Action</TableHead>
              {/* <TableHead>Delete</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="font-medium text-center py-10 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAgents?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="font-medium text-center py-10 text-muted-foreground"
                >
                  No Records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.agentName ? item.agentName : "-"}</TableCell>
                  <TableCell className="text-center">
                    {item.totalSearches}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {item?.lastLogin
                      ? getFormattedDateTime(item.lastLogin)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        item?.status === "ACTIVE"
                          ? "bg-[#E9F3E9] text-[#1E8221]"
                          : item?.status === "UNCONFIRMED"
                            ? "bg-[#FFF3D9] text-[#A2781E]"
                            : "bg-[#FFE3E2] text-[#FF5F59]"
                      } text-[13px] font-medium px-3 py-1 rounded-md`}
                    >
                      {item?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.status === "UNCONFIRMED" && (
                      <UserPlus
                        className="w-5 h-5 mx-auto"
                        // className={` text-sm`}
                        disabled={reinviteMutation?.isPending}
                        onClick={() =>
                          reinviteMutation?.mutate({ email: item?.email })
                        }
                        // variant="outline"
                        // size="sm"
                      />
                    )}
                    {/* {reinvitingAgentId === item.id
                        ? "Sending..."
                        : "Reinvite"} */}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="">
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
                          navigate(
                            `/broker/manage-agents/agent-property-details/${item?.id}`,
                          )
                        }
                      >
                        <Eye />
                      </Button>
                      <Button
                        size="icon"
                        className="text-md"
                        variant="ghost"
                        onClick={() => {
                          if (item?.status === "DELETED")
                            restoreUserMutation.mutate({
                              userId: item.id,
                              email: item.email,
                              userType: "agent",
                            });
                          else
                            deleteUserMutation.mutate({
                              userId: item.id,
                              email: item.email,
                              userType: "agent",
                            });
                        }}
                        disabled={
                          deleteUserMutation?.isLoading ||
                          restoreUserMutation?.isLoading
                        }
                      >
                        {item?.status === "DELETED" ? (
                          <ArchiveRestore />
                        ) : (
                          <Trash2 />
                        )}
                      </Button>
                      {/* {item.status !== "UNCONFIRMED" && (
                        <>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                            
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  unAssignAgent(item.id, item.agentId)
                                }
                              >
                                Unassign
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  toggleAgentStatus(
                                    item.agentId,
                                    item.status === "INACTIVE"
                                      ? "ACTIVE"
                                      : "INACTIVE"
                                  )
                                }
                              >
                                {item.status === "ACTIVE"
                                  ? "Inactive"
                                  : "Active"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )} */}
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    {item.status === CONSTANTS.USER_STATUS.DELETED ? (
                      <Button
                        className="text-sm"
                        size="sm"
                        disabled={
                          undeletingAgentId === item.id ||
                          reinvitingAgentId ||
                          deletingAgentId
                        }
                        onClick={() => handleUndelete(item)}
                      >
                        {undeletingAgentId === item.id
                          ? "Restoring..."
                          : "Undelete"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="text-sm"
                        variant="destructive"
                        disabled={
                          deletingAgentId === item.id ||
                          reinvitingAgentId ||
                          undeletingAgentId
                        }
                        onClick={() => handleDelete(item)}
                      >
                        {deletingAgentId === item.id ? "Deleting..." : "Delete"}
                      </Button>
                    )}
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* </div> */}
    </>
  );
}

function UnassignedAgents() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [filteredAgents, setFilteredAgents] = useState([]);

  const handleAssignAgent = async (id, name) => {
    const result = await assignAgent(id, name, user?.attributes?.sub);
    if (result) {
      setAgents((prevAgents) => prevAgents.filter((elem) => elem.id !== id));
      toast.success("Agent Assigned Successfully.");
      handleCreateAuditLog("ASSIGN", {
        detail: `Assigned Agent ${id}`,
      });
    }
  };

  const handleDeleteAgent = async (id, name, email) => {
    if (window.confirm(`Are you sure you want to delete agent: ${name}?`)) {
      const result = await deleteUser(id, email, CONSTANTS.USER_TYPES.AGENT);
      if (result) {
        setAgents((prevAgents) =>
          prevAgents.map((agent) =>
            agent.id === id ? { ...agent, status: result.status } : agent,
          ),
        );
        toast.success("Agent Deleted Successfully.");
        handleCreateAuditLog("DELETE", {
          detail: `Deleted Agent ${name} (${id})`,
        });
      }
    }
  };

  const handleUndeleteAgent = async (id, name, email) => {
    if (window.confirm(`Are you sure you want to restore agent: ${name}?`)) {
      const result = await undeleteUser(id, email, CONSTANTS.USER_TYPES.AGENT);
      if (result) {
        setAgents((prevAgents) =>
          prevAgents.map((agent) =>
            agent.id === id ? { ...agent, status: result.status } : agent,
          ),
        );
        toast.success("Agent Restored Successfully.");
        handleCreateAuditLog("RESTORE", {
          detail: `Restored Agent ${name} (${id})`,
        });
      }
    }
  };

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
  return (
    <>
      <div className="flex items-center gap-2 justify-end mb-3">
        <Checkbox
          id="show-deleted-checkbox"
          className="border-2 size-5 cursor-pointer bg-white"
          checked={showDeleted}
          onCheckedChange={(value) => setShowDeleted(value)}
        />
        <Label htmlFor="show-deleted-checkbox" className="text-sm mb-0">
          Show Deleted
        </Label>
      </div>
      <div className="bg-white !p-4 rounded-xl">
        <Table className="">
          <TableHeader className="bg-[#F5F0EC]">
            <TableRow>
              <TableHead className="w-[100px]">Sr. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assign</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="font-medium text-center py-10 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAgents?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="font-medium text-center py-10 text-muted-foreground"
                >
                  No Records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell> {item.email}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className={`text-sm`}
                      onClick={() => handleAssignAgent(item.id, item.name)}
                    >
                      Assign
                    </Button>
                  </TableCell>
                  <TableCell>
                    {item.status === CONSTANTS.USER_STATUS.DELETED ? (
                      <Button
                        onClick={() =>
                          handleUndeleteAgent(item.id, item.name, item.email)
                        }
                        className="text-sm"
                        size="sm"
                      >
                        Undelete
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          handleDeleteAgent(item.id, item.name, item.email)
                        }
                        className="text-sm"
                        size="sm"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

// export default ManageAgents;
