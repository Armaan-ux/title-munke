import { useEffect, useRef, useState } from "react";
// import "./index.css";
import { fetchAgentsWithSearchCount } from "@/components/service/broker";
import { Button } from "@/components/ui/button";
import { TableRow } from "@/components/ui/table";
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
  Download,
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

const userTypes = [
  // {
  //   name: "Admin",
  //   id: "admin",
  // },
  {
    name: "Broker",
    id: "broker",
  },
  {
    name: "Agent",
    id: "agent",
  },
];

export default function Users() {
  const [activeTab, setActiveTab] = useState(userTypes[0]);

  return (
    <div className="bg-[#F5F0EC] rounded-lg px-7 py-4 my-4 text-secondary">
      <div className="space-x-3 mb-4">
        {userTypes.map((item, index) => (
          <button
            key={item.id}
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

      {/* {activeTab.id === "admin" && <Admins />} */}
      {activeTab.id === "broker" && <AdminBrokersList />}
      {activeTab.id === "agent" && <Agents />}
    </div>
  );
}

function AdminBrokersList() {
  const [isBrokerListLoading, setIsBrokerListLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState({});
  const { user, organisationDetail } = useUser();
  const { userType } = useUserIdType();
  const [isAgentCreationModalOpen, setIsAgentCreationModalOpen] =
    useState(false);
  const [isAgentListOpen, setIsAgentListOpen] = useState(false);
  const [isAgentListLoading, setIsAgentListLoading] = useState(false);
  // State to track which broker's status is currently being updated
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentBrokerId, setCurrentBrokerId] = useState(null);
  const [brokers, setBrokers] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [activeBrokers, setActiveBrokers] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [totalBrokerCount, setTotalBrokerCount] = useState(0);
  const [totalActiveBrokerCount, setTotalActiveBrokerCount] = useState(0);
  const [totalBrokerSearchThisMonthCount, setTotalBrokerSearchThisMonthCount] =
    useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingBrokerId, setDeletingBrokerId] = useState(null);
  const { deleteUserMutation } = useDeleteUser(() => {
    handleFetchBrokersWithSearchCount(true);
    setHasMore(true);
  });
  const { restoreUserMutation } = useRestoreUser(() => {
    handleFetchBrokersWithSearchCount(true);
    setHasMore(true);
  });
  const loadingDelete =
    deleteUserMutation.isPending || restoreUserMutation.isPending;
  const getBroker = async () => {
    try {
      setLoading(true);
      const totalBrokerDict = await getTotalBrokers();
      const ActiveBrokers = await getActiveBrokers();
      const TotalBrokerSearchesThisMonthDict =
        await getTotalBrokerSearchesThisMonth();
      setTotalBrokerSearchThisMonthCount(
        TotalBrokerSearchesThisMonthDict.totalSearches,
      );
      setTotalBrokerCount(totalBrokerDict?.totalBrokers);
      setTotalActiveBrokerCount(ActiveBrokers?.length);
      setActiveBrokers(ActiveBrokers);
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

  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const handleFetchBrokersWithSearchCount = async (isRefetch) => {
    setIsBrokerListLoading(true);
    try {
      const response = await getOrgBrokersList({
        nextToken: isRefetch ? null : nextToken,
        limit: 10,
      });
      console.log("Fetched brokers with search count:", response);
      const { items: updatedBrokers, nextToken: newNextToken } = response;

      setBrokers((prev) =>
        isRefetch ? updatedBrokers : [...prev, ...updatedBrokers],
      );
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
    } catch (error) {
      console.error("Error fetching broker list:", error);
    }
    setIsBrokerListLoading(false);
  };

  const handleBrokerStatus = async (elem) => {
    const { id: brokerId, status: currentStatus } = elem;
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      setUpdatingStatusId(brokerId);
      await updateBrokerStatus(brokerId, newStatus);
      setBrokers((currentBrokers) =>
        currentBrokers.map(
          (broker) =>
            broker.id === brokerId
              ? { ...broker, status: newStatus } // Create a new object for the updated item
              : broker, // Return all other items as they are
        ),
      );
    } catch (error) {
      // Use the specific error message from the backend if available
      const errorMessage =
        error.response?.data?.message || "Failed to update broker status";
      console.error("Failed to update broker status:", error);
      toast.error(errorMessage);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const refreshCurrentAgentList = async () => {
    if (!currentBrokerId) return;

    setIsAgentListLoading(true);
    try {
      const response = await fetchAgentsWithSearchCount(currentBrokerId);
      setAgentList(response);
    } catch (err) {
      console.error("Failed to refresh agent list:", err);
    } finally {
      setIsAgentListLoading(false);
    }
  };

  const handleFetchAgentListForBroker = async (brokerId) => {
    setCurrentBrokerId(brokerId);
    try {
      setIsAgentListLoading(true);
      setIsAgentListOpen(true);
      const response = await fetchAgentsWithSearchCount(brokerId);
      setAgentList(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAgentListLoading(false);
    }
  };

  const handleDelete = async (broker) => {
    // if (window.confirm(`Are you sure you want to delete agent ${broker.agentName}? This is a soft delete.`)) {
    // }
    setDeletingBrokerId(broker.id);
    try {
      await deleteUser(broker.id, broker.email, CONSTANTS.USER_TYPES.BROKER);
      toast.success(`Broker ${broker.name} has been deleted.`);
      // Call the refresh function passed from the parent component.
      // if (onListRefresh) onListRefresh();
      getBroker();
    } catch (error) {
      console.error("Failed to delete broker:", error);
      toast.error(
        `Failed to delete broker. ${error?.response?.data?.message || ""}`,
      );
    } finally {
      setDeletingBrokerId(null);
    }
  };
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
              <div className="flex items-center gap-2">
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
                <div className="space-x-2">
                  <Button variant="secondary" onClick={() => setIsOpen(true)}>
                    {" "}
                    <PlusCircle /> Add Broker
                  </Button>
                </div>
              </div>
            </div>

            <Table className="">
              <TableHeader className="bg-[#F5F0EC]">
                <TableRow>
                  <TableHead>Sr. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Team Strength</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brokers?.filter(
                  (item) =>
                    statusFilter === "ALL" || item.status === statusFilter,
                )?.length === 0 && !isBrokerListLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="font-medium text-center py-10 text-muted-foreground"
                    >
                      No Records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  brokers
                    ?.filter(
                      (item) =>
                        statusFilter === "ALL" || item.status === statusFilter,
                    )
                    ?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium ">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-black">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.teamStrength || "-"}</TableCell>
                        <TableCell>
                          {" "}
                          <Badge
                            className={`${
                              item?.status === "ACTIVE"
                                ? "bg-[#E9F3E9] text-[#1E8221]"
                                : item?.status === "DELETED"
                                  ? " text-destructive/80 bg-destructive/20"
                                  : "bg-[#FFF3D9] text-[#A2781E]"
                            } text-[13px] font-medium px-3 py-1 rounded-full`}
                          >
                            {item?.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 flex-row">
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
                              {item?.status === "DELETED" ? (
                                <ArchiveRestore />
                              ) : (
                                <Trash2 />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>

            <div className="text-center flex flex-col gap-4 my-4  text-muted-foreground">
              {isBrokerListLoading && <p>Loading...</p>}
              {!hasMore && brokers?.length !== 0 && (
                <p>No more data to load.</p>
              )}
              {brokers?.length > 0 && hasMore && !isBrokerListLoading && (
                <Button
                  size="sm"
                  className=""
                  onClick={() => handleFetchBrokersWithSearchCount()}
                >
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

function Agents() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, organisationDetail } = useUser();
  const { userType } = useUserIdType();
  const [agents, setAgents] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isAgentListLoading, setIsAgentListLoading] = useState(false);
  const [nextToken, setNextToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  useEffect(() => {
    handleFetchAgentListing();
  }, []);
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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
                </div>
                <Button variant="secondary" onClick={() => setIsOpen(true)}>
                  {" "}
                  <PlusCircle /> Add Agent
                </Button>
              </div>
            </div>

            <Table className="">
              <TableHeader className="bg-[#F5F0EC]">
                <TableRow>
                  <TableHead>Sr. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Reinvite</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents?.filter(
                  (item) =>
                    statusFilter === "ALL" || item.status === statusFilter,
                )?.length === 0 && !hasMore ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="font-medium text-center py-10 text-muted-foreground"
                    >
                      No Records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  agents
                    ?.filter(
                      (item) =>
                        statusFilter === "ALL" || item.status === statusFilter,
                    )
                    ?.map((item, index) => (
                      <TableRow key={item?.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-black font-medium">
                          {item?.name}
                        </TableCell>
                        <TableCell>{item?.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              item?.status === "ACTIVE"
                                ? "bg-[#E9F3E9] text-[#1E8221]"
                                : item?.status === "DELETED"
                                  ? " text-destructive/80 bg-destructive/20"
                                  : "bg-[#FFF3D9] text-[#A2781E]"
                            } text-[13px] font-medium px-3 py-1 rounded-full`}
                          >
                            {item?.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {item?.status === "UNCONFIRMED" && (
                            <Button
                              size="icon"
                              className="text-md"
                              variant="ghost"
                              onClick={() =>
                                reinviteMutation.mutate({ email: item.email })
                              }
                              disabled={reinviteMutation.isPending}
                            >
                              <UserPlus />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 flex-row">
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
                              {item?.status === "DELETED" ? (
                                <ArchiveRestore />
                              ) : (
                                <Trash2 />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            <div className="text-center flex flex-col gap-4 my-4  text-muted-foreground">
              {isAgentListLoading && <p>Loading...</p>}
              {!hasMore && !isAgentListLoading && agents?.length !== 0 && (
                <p>No more data to load.</p>
              )}
              {agents?.length > 0 && hasMore && !isAgentListLoading && (
                <Button
                  size="sm"
                  className=""
                  onClick={handleFetchAgentListing}
                >
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
