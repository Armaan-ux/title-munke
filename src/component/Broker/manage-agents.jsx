import { useCallback, useEffect, useState } from "react";
import AddUserModal from "@/component/Modal/AddUserModal";
import {
  // assignAgent,
  // calculateAverage,
  // getTopPerformerAgent,
  // inActiveAgent,
  // pendingAgentSearch,
  // UnassignAgent,
} from "@/component/service/agent";
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
    } from "@/component/service/userAdmin";
import { useUser } from "@/context/usercontext";
import { fetchAgentsWithSearchCount } from "@/component/service/broker";
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
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, PencilLine, Plus, PlusCircle, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { API } from "aws-amplify";
import { listAgents } from "@/graphql/queries";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const agentTypes = [
    {
        name: "Agents",
        id: "agents" 
    },
    {
        name: "Unassigned Agents",
        id: "unassigned-agents"
    },
    // {
    //     name: "Agent",
    //     id: "agent" 
    // }
]


export default function ManageAgents(){
  const [activeTab, setActiveTab] = useState(agentTypes[0]);
  return (
    
        <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">

          <div className="space-x-3 mb-4" >
            {
                agentTypes.map((item, index) => (
                        <button 
                            className={` ${activeTab.id === item.id ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] " } transition-all  rounded-full px-10 py-3 `}
                            onClick={() => setActiveTab(item)}
                         >{item.name}
                        </button>
                ))
            }
            </div>

          
             
               {activeTab.id === "agents" && <Agents />}
               {activeTab.id === "unassigned-agents" && <UnassignedAgents />}
               
             
         
        </div>
  )
}

function Agents(){
  const { user } = useUser();
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
            getAgentsTotalSearches(user.attributes.sub, currentMonthStart, nextMonthStart),
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
        : agents.filter((agent) => agent.status !== CONSTANTS.USER_STATUS.DELETED);
      setFilteredAgents(filtered);
    }
  }, [agents, showDeleted]);

  const unAssignAgent = async (agentId) => {
    const result = await UnassignAgent(agentId);
    if (result) {
      setAgents((prevAgents) => prevAgents.filter((elem) => elem.agentId !== agentId));
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
          agent.agentId === id ? { ...agent, status: status } : agent
        )
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
    if (window.confirm(`Are you sure you want to delete agent ${agent.agentName}? This is a soft delete.`)) {
      setDeletingAgentId(agent.id);
      try {
        await deleteUser(agent.id, agent.email, CONSTANTS.USER_TYPES.AGENT);
        toast.success(`Agent ${agent.agentName} has been deleted.`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete agent:", error);
        toast.error(`Failed to delete agent. ${error?.response?.data?.message || ""}`);
      } finally {
        setDeletingAgentId(null);
      }
    }
  };

  const handleUndelete = async (agent) => {
    if (window.confirm(`Are you sure you want to restore agent ${agent.agentName}?`)) {
      setUndeletingAgentId(agent.id);
      try {
        await undeleteUser(agent.id, agent.email, CONSTANTS.USER_TYPES.AGENT);
        toast.success(`Agent ${agent.agentName} has been restored.`);
        fetchData();
      } catch (error) {
        console.error("Failed to restore agent:", error);
        toast.error(`Failed to restore agent. ${error?.response?.data?.message || ""}`);
      } finally {
        setUndeletingAgentId(null);
      }
    }
  };

  return (
    <>
    <AddUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userType="agent"
        setUser={setAgents}
        agents={agents} // Pass agents to check for duplicates
    />
         <div className="flex items-center gap-2 justify-end mb-3" >
          <Checkbox
            id="show-deleted-checkbox"
            className="border-2 size-5 cursor-pointer bg-white"
            checked={showDeleted}
            onCheckedChange={(value) => setShowDeleted(value)}
          />
          <Label htmlFor="show-deleted-checkbox" className="text-sm mb-0" >Show Deleted</Label>
        </div>
      
        <div className="bg-white !p-4 rounded-xl" >

            <Table className=""  >
              <TableHeader className="bg-[#F5F0EC]" >
                <TableRow>
                  <TableHead className="w-[100px]">Sr. No.</TableHead>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Searchers This Month</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reinvite</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  loading?
                  <TableRow >
                    <TableCell colSpan={8} className="font-medium text-center py-10 text-muted-foreground">Loading...</TableCell>
                  </TableRow> :
                  filteredAgents?.length === 0 ?
                  <TableRow >
                    <TableCell colSpan={8} className="font-medium text-center py-10 text-muted-foreground">No Records found.</TableCell>
                  </TableRow>
                  :
                  filteredAgents?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.agentName}</TableCell>
                      <TableCell>{item.totalSearches}</TableCell>
                      <TableCell>{getFormattedDateTime(item.lastLogin)}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <Button
                            className={` text-sm`}
                            disabled={item.status !== "UNCONFIRMED" || !!reinvitingAgentId}
                            onClick={() => handleReinvite(item)}
                            variant="outline"
                            size='sm'
                          >
                            {reinvitingAgentId === item.id ? "Sending..." : "Reinvite"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="dropdown">
                        {item.status !== "UNCONFIRMED" && (
                          <>

                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button size="icon" className="text-sm" variant="ghost" > <PencilLine /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => unAssignAgent(item.id, item.agentId)}>Unassign</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleAgentStatus(item.agentId, item.status === "INACTIVE" ? "ACTIVE" : "INACTIVE")}>
                                  {item.status === "ACTIVE" ? "Inactive" : "Active"}
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                      </TableCell>
                      <TableCell>
                        {item.status === CONSTANTS.USER_STATUS.DELETED ? (
                          <Button
                            className="text-sm"
                            size="sm"
                            disabled={undeletingAgentId === item.id || reinvitingAgentId || deletingAgentId}
                            onClick={() => handleUndelete(item)}
                          >
                            {undeletingAgentId === item.id ? "Restoring..." : "Undelete"}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="text-sm"
                            variant="destructive"
                            disabled={deletingAgentId === item.id || reinvitingAgentId || undeletingAgentId}
                            onClick={() => handleDelete(item)}
                          >
                            {deletingAgentId === item.id ? "Deleting..." : "Delete"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow> 
                  ))
                }

              </TableBody>
            </Table>
        </div>
     
    {/* </div> */}
    </>
  );
};


function UnassignedAgents(){

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
            agent.id === id ? { ...agent, status: result.status } : agent
          )
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
            agent.id === id ? { ...agent, status: result.status } : agent
          )
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
       <div className="flex items-center gap-2 justify-end mb-3" >
                <Checkbox
                  id="show-deleted-checkbox"
                  className="border-2 size-5 cursor-pointer bg-white"
                  checked={showDeleted}
                  onCheckedChange={(value) => setShowDeleted(value)}
                />
                <Label htmlFor="show-deleted-checkbox" className="text-sm mb-0" >Show Deleted</Label>
              </div>
     <div className="bg-white !p-4 rounded-xl"  >


                  <Table className=""  >
                        <TableHeader className="bg-[#F5F0EC]" >
                          <TableRow>
                            <TableHead className="w-[100px]">Sr. No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assign</TableHead>
                            <TableHead>Delete</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody >
                          {
                            isLoading ?
                            <TableRow >
                              <TableCell colSpan={6} className="font-medium text-center py-10 text-muted-foreground">Loading...</TableCell>
                            </TableRow>
                            :
                            filteredAgents?.length === 0 ?
                            <TableRow >
                              <TableCell colSpan={6} className="font-medium text-center py-10 text-muted-foreground">No Records found.</TableCell>
                            </TableRow>
                            :
                            filteredAgents?.map((item, index) => (
                              <TableRow key={item.id} >
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
                                        onClick={() => handleUndeleteAgent(item.id, item.name, item.email)}
                                        className="text-sm"
                                        size="sm"
                                      >
                                        Undelete
                                      </Button>
                                    ) : (
                                      <Button
                                        onClick={() => handleDeleteAgent(item.id, item.name, item.email)}
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
                          }
          
                        </TableBody>
                      </Table>

       
      </div>
   </>

  )
}

// export default ManageAgents;



