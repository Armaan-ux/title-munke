import { useEffect, useState } from "react";
import AddUserModal from "@/component/Modal/AddUserModal";
import {
  assignAgent,
  calculateAverage,
  getTopPerformerAgent,
  inActiveAgent,
  pendingAgentSearch,
  UnassignAgent,
} from "@/component/service/agent";
import {
    reinviteAgent,
    getAgentsTotalSearches,
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
  const [pendingSearch, setPendingSearch] = useState(0);
  const [topPerformer, setTopPerformer] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);
        const nextMonthStart = new Date(currentMonthStart);
        nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);

        const [totalSearches, agents, pendingSearches, topPerformer] =
          await Promise.all([
            getAgentsTotalSearches(user.attributes.sub, currentMonthStart, nextMonthStart),
            fetchAgentsWithSearchCount(user.attributes.sub),
            pendingAgentSearch(user.attributes.sub),
            getTopPerformerAgent(user.attributes.sub),
          ]);

        setTotalSearchesThisMonth(totalSearches.totalSearches);
        setAgents(agents);
        setPendingSearch(pendingSearches.pendingSearches);
        setTopPerformer(topPerformer);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.attributes?.sub) {
      fetchData();
      const interval = setInterval(fetchData, 1800000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const unAssignAgent = async (id, agentId) => {
    const result = await UnassignAgent(id, agentId);
    if (result) {
      setAgents((prevAgents) => prevAgents.filter((elem) => elem.id !== id));
      toast.success("Agent UnAssigned Successfully.");
      handleCreateAuditLog("UNASSIGN", {
        detial: `Unassigned Agent ${agentId}`,
      });
    }
  };

  const inActiveAgentStatus = async (id, status) => {
    const result = await inActiveAgent(id, status);
    if (result) {
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.agentId === id ? { ...agent, status: status } : agent
        )
      );
      toast.success(`Agent ${status} Successfully.`);
      handleCreateAuditLog("ACTIVE_STATUS", {
        detial: `Convert Agent ${id} Status to ${status}`,
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

//   const agentss = [
//     {
//         "__typename": "Relationship",
//         "updatedAt": "2025-08-29T14:32:09.376Z",
//         "brokerName": "Ravinder",
//         "createdAt": "2025-08-29T14:32:09.376Z",
//         "agentId": "d4185428-80e1-70e7-7507-11778d708c04",
//         "id": "d4185428-80e1-70e7-7507-11778d708c04",
//         "agentName": "RS",
//         "brokerId": "a4a894b8-5061-7039-6b23-f37722d94011",
//         "status": "ACTIVE",
//         "email": "Ravinsandhu2@gmail.com",
//         "lastLogin": "2025-08-29T14:46:37.414Z",
//         "totalSearches": 0
//     }
// ]

  return (
    <>
    <AddUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userType="agent"
        setUser={setAgents}
        agents={agents} // Pass agents to check for duplicates
    />
    {/* <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary"> */}

        {/* <div className="flex justify-between items-center gap-4 my-4" >
            <div className="flex gap-3 items-center" >
                <p className="font-medium text-lg" >All Agents</p>
                <div className="relative" >
                    <Input className="pr-10 placeholder:text-[#E2DEDC] bg-white border-none" placeholder="Search" />
                    <Search className="absolute right-3 top-3 text-[#D7C4B6]" size={18} />
                </div>
            </div>
            <Button variant="secondary" onClick={() => setIsOpen(true)} >
                <PlusCircle /> Add User 
            </Button>
        </div> */}
      
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
                  agents?.length === 0 ?
                  <TableRow >
                    <TableCell colSpan={8} className="font-medium text-center py-10">No Records found.</TableCell>
                  </TableRow>
                  :
                  agents?.map((item, index) => (
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
                                <DropdownMenuItem onClick={() => inActiveAgentStatus(item.agentId, item.status === "INACTIVE" ? "ACTIVE" : "INACTIVE")}>
                                  {item.status === "ACTIVE" ? "Inactive" : "Active"}
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>


                            {/* <button className="btn action-btn">
                              Actions <i className="fas fa-caret-down"></i>
                            </button>

                            <div className="dropdown-content">
                              <span
                                onClick={() =>
                                  unAssignAgent(item.id, item.agentId)
                                }
                              >
                                Unassign
                              </span>
                              <span
                                onClick={() =>
                                  inActiveAgentStatus(
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
                              </span>
                            </div> */}
                          </>
                        )}
                      </div>
                      </TableCell>
                      <TableCell>
                          <Button variant="destructive" size="sm" className="text-sm" >Delete</Button>
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
  
    const handleAssignAgent = async (id, name) => {
      const result = await assignAgent(id, name, user?.attributes?.sub);
      if (result) {
        setAgents(agents.filter((elem) => elem.id !== id));
        toast.success("Agent Assigned Successfully.");
        handleCreateAuditLog("ASSIGN", {
          detial: `Assigned Agent ${id}`,
        });
      }
    };
  
    useEffect(() => {
      const fetchNotAssignedAgents = async () => {
        try {
          setIsLoading(true);
          const response = await API.graphql({
            query: listAgents,
            variables: {
              filter: { assigned: { eq: false } },
            },
          });
          const { items } = response.data.listAgents;
          setAgents(items);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNotAssignedAgents();
    }, []);
  return (
   <>
     <div className="bg-white !p-4 rounded-xl"  >

                  <Table className=""  >
                        <TableHeader className="bg-[#F5F0EC]" >
                          <TableRow>
                            <TableHead className="w-[100px]">Sr. No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody >
                          {
                            isLoading ?
                            <TableRow >
                              <TableCell colSpan={5} className="font-medium text-center py-10">Loading...</TableCell>
                            </TableRow>
                            :
                            agents?.length === 0 ?
                            <TableRow >
                              <TableCell colSpan={5} className="font-medium text-center py-10">No Records found.</TableCell>
                            </TableRow>
                            :
                            agents?.map((item, index) => (
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



