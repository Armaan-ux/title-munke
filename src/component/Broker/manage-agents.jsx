import { useEffect, useState } from "react";
import AddUserModal from "@/component/Modal/AddUserModal";
import {
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
import { Plus, PlusCircle, Search } from "lucide-react";

const ManageAgents = () => {
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

  return (
    <>
      {/* {isOpen && (
    )} */}
    <AddUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userType="agent"
        setUser={setAgents}
        agents={agents} // Pass agents to check for duplicates
    />
    <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">

        <div className="flex justify-between items-center gap-4 my-4" >
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  agents?.length === 0 ?
                  <TableRow >
                    <TableCell colSpan={7} className="font-medium text-center py-10">No Records found.</TableCell>
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
                        <button
                            className={`reinvite-btn ${
                            reinvitingAgentId === item.id ? "reinviting" : ""}`}
                            disabled={item.status !== "UNCONFIRMED" || !!reinvitingAgentId}
                            onClick={() => handleReinvite(item)}
                          >
                            {reinvitingAgentId === item.id ? "Sending..." : "Reinvite"}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="dropdown">
                        {item.status !== "UNCONFIRMED" && (
                          <>
                            <button className="btn action-btn">
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
                            </div>
                          </>
                        )}
                      </div>
                      </TableCell>
                    </TableRow> 
                  ))
                }

              </TableBody>
            </Table>
        </div>
     
    </div>
      {/* <div className="main-content" style={{ display: "block" }}>

        <div className="assigned-agent-card" style={{ width: "98%" }}>
          <h3>Assigned Agents</h3>
          <table className="assigned-agent-styled-table table-container">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Searches This Month</th>
                <th>Last login</th>
                <th>Actions</th>
                <th>Reinvite</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <p style={{ display: "flex" }}>Loading.....</p>
              ) : agents?.length === 0 ? (
                <p style={{ display: "flex" }}>No Records Found.</p>
              ) : (
                agents?.map((elem) => (
                  <tr key={elem.id} id={`broker-row-${elem.id}`}>
                    <td>{elem.agentName}</td>
                    <td>
                      <span className={`status ${elem.status?.toLowerCase()}`}>
                        {elem.status}
                      </span>
                    </td>
                    <td>{elem.totalSearches}</td>
                    <td>{getFormattedDateTime(elem.lastLogin)}</td>
                    <td>
                      <div className="dropdown">
                        {elem.status !== "UNCONFIRMED" && (
                          <>
                            <button className="btn action-btn">
                              Actions <i className="fas fa-caret-down"></i>
                            </button>

                            <div className="dropdown-content">
                              <span
                                onClick={() =>
                                  unAssignAgent(elem.id, elem.agentId)
                                }
                              >
                                Unassign
                              </span>
                              <span
                                onClick={() =>
                                  inActiveAgentStatus(
                                    elem.agentId,
                                    elem.status === "INACTIVE"
                                      ? "ACTIVE"
                                      : "INACTIVE"
                                  )
                                }
                              >
                                {elem.status === "ACTIVE"
                                  ? "Inactive"
                                  : "Active"}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        className={`reinvite-btn ${
                          reinvitingAgentId === elem.id ? "reinviting" : ""
                        }`}
                        disabled={
                          elem.status !== "UNCONFIRMED" || !!reinvitingAgentId
                        }
                        onClick={() => handleReinvite(elem)}
                      >
                        {reinvitingAgentId === elem.id
                          ? "Sending..."
                          : "Reinvite"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </>
  );
};

export default ManageAgents;