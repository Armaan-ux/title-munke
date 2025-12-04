import { API } from "aws-amplify";
import { useState, useEffect } from "react";
// import "./index.css";
import { getFormattedDateTime } from "@/utils";
import { fetchAgentsWithSearchCount } from "@/components/service/broker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArchiveRestore, EyeIcon, PencilLine, PlusCircle, Trash2, UserPlus } from "lucide-react";
import AddUserModal from "../Modal/AddUserModal";
import AgentList from "../Modal/AgentList";
import AddAgentByAdminModal from "../Modal/AddAgentByAdminModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import {
  CONSTANTS,
  deleteUser,
  getActiveBrokers,
  getAgentListings,
  getBrokersWithSearchCount,
  getTotalBrokers,
  getTotalBrokerSearchesThisMonth,
  listAdmins,
  reinviteUser,
  updateBrokerStatus,
} from "../service/userAdmin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "../ui/badge";
import AddAdminModal from "../Modal/AddAdminModal";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useRestoreUser } from "@/hooks/useRestoreUser";
import { useMutation } from "@tanstack/react-query";
import { useUserIdType } from "@/hooks/useUserIdType";
import { set } from "zod";

const userTypes = [
  {
    name: "Admin",
    id: "admin",
  },
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

      {activeTab.id === "admin" && <Admins />}
      {activeTab.id === "broker" && <AdminBrokersList />}
      {activeTab.id === "agent" && <Agents />}
    </div>
  );
}

function Admins() {
  const {userId} = useUserIdType();
  const [isOpen, setIsOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isAdminListLoading, setIsAdminListLoading] = useState(false);
  const [nextToken, setNextToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const {deleteUserMutation} = useDeleteUser(() => {handleFetchAdminListing(true); setHasMore(true);});
  const {restoreUserMutation} = useRestoreUser(() => {handleFetchAdminListing(true); setHasMore(true);});
  const handleFetchAdminListing = async (isRefetch) => {
    setIsAdminListLoading(true);
    try {
      const response = await listAdmins(isRefetch ? null : nextToken);
      const {items, nextToken: newNextToken} = response;
      setAdmins(pre => isRefetch ? items : [...pre, ...items]);
      setNextToken(newNextToken);
      setHasMore(!!newNextToken)
    } catch (error) {
      console.log(error)
    }
    setIsAdminListLoading(false);
  }

  useEffect(() => {handleFetchAdminListing()}, []);
  const loading = deleteUserMutation.isPending || restoreUserMutation.isPending;

  return (
    <>
     {isOpen && 
      <AddAdminModal  
          open={isOpen} 
          onClose={()=> {setIsOpen(false); setSelectedUser({})}} 
          title="Admin"  
          userType="admin" 
          invalidateFun={() => {handleFetchAdminListing(true); setHasMore(true);}}
          selectedUser={selectedUser}
        />
     }
    <div className="bg-white !p-4 rounded-xl">
      {/* <AddUserModal
        setIsOpen={setIsOpen}
        userType="admin"
        setUser={setAdmins}
        isOpen={isOpen}
      /> */}
      <div className="flex justify-between gap-4 items-center mb-4">
        <p className="text-lg font-medium" >All Admins</p>
        <Button variant="secondary" onClick={() => setIsOpen(true)}>
          {" "}
          <PlusCircle /> Add Admin
        </Button>
      </div>

      <Table className="">
        <TableHeader className="bg-[#F5F0EC]">
          <TableRow>
            <TableHead className="">Sr. No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead >Status</TableHead>
            <TableHead >Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins?.length === 0 && !hasMore ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="font-medium text-center py-10 text-muted-foreground"
              >
                No Records found.
              </TableCell>
            </TableRow>
          ) : (
            admins?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium ">{index + 1}</TableCell>
                <TableCell className="font-medium text-black" >{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      item?.status === "ACTIVE"
                        ? "bg-[#E9F3E9] text-[#1E8221]"
                        : "bg-[#FFF3D9] text-[#A2781E]"
                    } text-[13px] font-medium px-3 py-1 rounded-full`}
                  >
                    {item?.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 flex-row">
                    <Button size="icon" className="text-md" variant="ghost" onClick={() => { setSelectedUser(item); setIsOpen(true)}}>
                      <PencilLine />
                    </Button>
                    {userId !== item?.id &&
                      <Button 
                            size="icon" 
                            className="text-md" 
                            variant="ghost" 
                            onClick={() => {
                              if(item?.status === "DELETED")
                                restoreUserMutation.mutate({userId: item.id, email: item.email, userType: "admin"})
                              else
                              deleteUserMutation.mutate({userId: item.id, email: item.email, userType: "admin"})
                            }} 
                            disabled={loading}
                          >
                            {item?.status === "DELETED" ? <ArchiveRestore /> : <Trash2 />}
                      </Button>
                    }
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="text-center flex flex-col gap-4 my-4  text-muted-foreground">
            {isAdminListLoading && <p>Loading...</p>}
            {!hasMore && !isAdminListLoading && <p>No more data to load.</p>}
            {admins?.length > 0 && hasMore && !isAdminListLoading && (
              <Button
                size="sm"
                className=""
                onClick={() => handleFetchAdminListing()}
              >
                Load More
              </Button>
            )}
        </div>
    </div>
    </>
  );
}

function AdminBrokersList() {
  const [isBrokerListLoading, setIsBrokerListLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState({});
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
  const [deletingBrokerId, setDeletingBrokerId] = useState(null);
  const {deleteUserMutation} = useDeleteUser(() => {handleFetchBrokersWithSearchCount(true); setHasMore(true);});
  const {restoreUserMutation} = useRestoreUser(() => {handleFetchBrokersWithSearchCount(true); setHasMore(true);});
  const loadingDelete = deleteUserMutation.isPending || restoreUserMutation.isPending;
  const getBroker = async () => {
    try {
      setLoading(true);
      const totalBrokerDict = await getTotalBrokers();
      const ActiveBrokers = await getActiveBrokers();
      const TotalBrokerSearchesThisMonthDict =
        await getTotalBrokerSearchesThisMonth();
      setTotalBrokerSearchThisMonthCount(
        TotalBrokerSearchesThisMonthDict.totalSearches
      );
      setTotalBrokerCount(totalBrokerDict?.totalBrokers);
      setTotalActiveBrokerCount(ActiveBrokers?.length);
      setActiveBrokers(ActiveBrokers); // Store the fetched active brokers in state
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
      const response = await getBrokersWithSearchCount(isRefetch ? null : nextToken);
      const { updatedBrokers, nextToken: newNextToken } = response;

      setBrokers((prev) => isRefetch ? updatedBrokers : [...prev, ...updatedBrokers]);
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
    } catch (error) {
      console.error("Error fetching search histories:", error);
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
              : broker // Return all other items as they are
        )
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
        `Failed to delete broker. ${error?.response?.data?.message || ""}`
      );
    } finally {
      setDeletingBrokerId(null);
    }
  };

  return (
    <>
      {/* <AgentList
        data={agentList}
        isOpen={isAgentListOpen}
        // isOpen={true}
        setIsOpen={setIsAgentListOpen}
        isAgentListLoading={isAgentListLoading}
        onListRefresh={refreshCurrentAgentList}
      /> */}

      {/* <AddUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userType={"broker"}
        setUser={setBrokers}
      /> */}
{/* 
      <AddAgentByAdminModal
        isOpen={isAgentCreationModalOpen}
        setIsOpen={setIsAgentCreationModalOpen}
        brokers={activeBrokers}
      /> */}
      {isOpen && 
        <AddAdminModal  
          open={isOpen} onClose={()=> {setIsOpen(false); setSelectedBroker({})}} 
          title="Broker" 
          userType="broker" 
          invalidateFun={() => {handleFetchBrokersWithSearchCount(true); setHasMore(true);}} 
          selectedUser={selectedBroker}
        />
    }

      <div>
        <div className="bg-white !p-4 rounded-xl">
          <div className="flex justify-between gap-4 items-center mb-4">
            <p className="text-lg font-medium" >All Brokers</p>

            <div className="space-x-2">
              <Button variant="secondary" onClick={() => setIsOpen(true)}>
                {" "}
                <PlusCircle /> Add Broker
              </Button>
            </div>
          </div>

          <Table className="">
            <TableHeader className="bg-[#F5F0EC]">
              <TableRow>
                <TableHead>Sr. No.</TableHead>
                <TableHead>Name</TableHead>
                {/* <TableHead>Monthly Searches</TableHead>
                <TableHead>Last Login</TableHead> */}
                <TableHead>Email</TableHead>
                <TableHead>Team Strength</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
                {/* <TableHead>Agent List</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {brokers?.length === 0 && !isBrokerListLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="font-medium text-center py-10 text-muted-foreground"
                  >
                    No Records found.
                  </TableCell>
                </TableRow>
              ) : (
                brokers?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium ">{index + 1}</TableCell>
                    <TableCell className="font-medium text-black" >{item.name}</TableCell>
                    {/* <TableCell>{item.totalSearches}</TableCell> */}
                    {/* <TableCell>
                      {getFormattedDateTime(item.lastLogin)}
                    </TableCell> */}
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.teamStrength || "-"}</TableCell>
                    <TableCell>
                      {" "}
                      <Badge
                        className={`${
                          item?.status === "ACTIVE"
                            ? "bg-[#E9F3E9] text-[#1E8221]"
                            : "bg-[#FFF3D9] text-[#A2781E]"
                        } text-[13px] font-medium px-3 py-1 rounded-full`}
                      >
                        {item?.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-row">
                        <Button size="icon" className="text-md" variant="ghost" onClick={() => { setSelectedBroker(item); setIsOpen(true)}}>
                          <PencilLine />
                        </Button>
                        <Button 
                          size="icon" 
                          className="text-md" 
                          variant="ghost" 
                          onClick={() => {
                            if(item?.status === "DELETED")
                              restoreUserMutation.mutate({userId: item.id, email: item.email, userType: "broker"})
                            else
                            deleteUserMutation.mutate({userId: item.id, email: item.email, userType: "broker"})
                          }} 
                          disabled={loadingDelete}
                        >
                          {item?.status === "DELETED" ? <ArchiveRestore /> : <Trash2 />}
                    </Button>
                      </div>

                      {/* <div >
                              {item.status !== "UNCONFIRMED" && (
                                <>

                              
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button size="icon" className="text-sm" variant="ghost" > <PencilLine /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleBrokerStatus(item)}>{item.status === "ACTIVE" ? "Inactive" : "Active"}</DropdownMenuItem>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <AlertDialog  >
                                    <AlertDialogTrigger >
                                      Delete
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="!font-poppins font-medium" >Are you absolutely sure?</AlertDialogTitle>
                                       
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction disabled={deletingBrokerId === item.id} onClick={async () => await handleDelete(item) } >Continue</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>

                                  </AlertDialog>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                                </>
                              )}
                            </div> */}
                    </TableCell>
                    {/* <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleFetchAgentListForBroker(item.id)}
                      >
                        <EyeIcon />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="text-center flex flex-col gap-4 my-4  text-muted-foreground">
            {isBrokerListLoading && <p>Loading...</p>}
            {!hasMore && <p>No more data to load.</p>}
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
        </div>
      </div>
    </>
  );
}


function Agents() {
  const [isOpen, setIsOpen] = useState(false);
  const [agents, setAgents] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isAgentListLoading, setIsAgentListLoading] = useState(false);
  const [nextToken, setNextToken] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  useEffect(() => {
    handleFetchAgentListing();
  }, []);
  const {deleteUserMutation} = useDeleteUser(() => {handleFetchAgentListing(true); setHasMore(true);});
  const {restoreUserMutation} = useRestoreUser(() => {handleFetchAgentListing(true); setHasMore(true);});
  const reinviteMutation = useMutation({
    mutationFn: (payload) => reinviteUser(payload),
    onSuccess: () => {
      toast.success("Reinvite sent successfully");
      handleFetchAgentListing(true);
      setHasMore(true);
    }
  })
  const handleFetchAgentListing = async (isRefetch) => {
    
    setIsAgentListLoading(true);
    try {
      const response = await getAgentListings(isRefetch? null : nextToken);
      const { items, nextToken: newNextToken } = response;

      setAgents((prev) => isRefetch ? items : [...prev, ...items]);
      setNextToken(newNextToken);
      setHasMore(!!newNextToken);
    } catch (error) {
      console.error("Error fetching search histories:", error);
    }
    setIsAgentListLoading(false);
  };
  const loading = deleteUserMutation.isPending || restoreUserMutation.isPending;
  return (
    <>
     {isOpen && 
      <AddAdminModal  
        open={isOpen} 
        onClose={()=> {setIsOpen(false); setSelectedUser({})}}  
        title="Agent" 
        userType="agent" 
        invalidateFun={() => {handleFetchAgentListing(true); setHasMore(true);}}
        selectedUser={selectedUser}
      />
     }
    <div className="bg-white !p-4 rounded-xl">
      {/* <AddUserModal
        setIsOpen={setIsOpen}
        userType="admin"
        setUser={setAdmins}
        isOpen={isOpen}
      /> */}
      <div className="flex justify-between gap-4 items-center mb-4">
        <p className="text-lg font-medium" >All Agents</p>
        <Button variant="secondary" onClick={() => setIsOpen(true)}>
          {" "}
          <PlusCircle /> Add Agent
        </Button>
      </div>

      <Table className="">
        <TableHeader className="bg-[#F5F0EC]">
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center" >Reinvite</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents?.length === 0 && !hasMore ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="font-medium text-center py-10 text-muted-foreground"
              >
                No Records found.
              </TableCell>
            </TableRow>
          ) : (
            agents?.map((item, index) => (
              <TableRow key={item?.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="text-black font-medium" >{item?.name}</TableCell>
                <TableCell>{item?.email}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      item?.status === "ACTIVE"
                        ? "bg-[#E9F3E9] text-[#1E8221]"
                        : "bg-[#FFF3D9] text-[#A2781E]"
                    } text-[13px] font-medium px-3 py-1 rounded-full`}
                  >
                    {item?.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center" >
                    {item?.status === "UNCONFIRMED" &&
                    <Button 
                      size="icon" 
                      className="text-md" 
                      variant="ghost"
                      onClick={() => reinviteMutation.mutate({email: item.email})}
                      disabled={reinviteMutation.isPending}
                    >
                      <UserPlus />
                    </Button>
                  }
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 flex-row">
                    <Button size="icon" className="text-md" variant="ghost" onClick={() => { setSelectedUser(item); setIsOpen(true)}}>
                      <PencilLine />
                    </Button>
                    <Button 
                      size="icon" 
                      className="text-md" 
                      variant="ghost" 
                      onClick={() => {
                        if(item?.status === "DELETED")
                          restoreUserMutation.mutate({userId: item.id, email: item.email, userType: "agent"})
                        else
                        deleteUserMutation.mutate({userId: item.id, email: item.email, userType: "agent"})
                      }} 
                      disabled={loading}
                    >
                      {item?.status === "DELETED" ? <ArchiveRestore /> : <Trash2 />}
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
            {!hasMore && !isAgentListLoading && <p>No more data to load.</p>}
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
    </div>
    </>
  );
}