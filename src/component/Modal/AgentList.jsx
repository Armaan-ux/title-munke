import React, { useEffect, useState } from "react";
import { getFormattedDateTime } from "../../utils";
// import { reinviteAgent } from "../service/agent";
import { CONSTANTS, deleteUser, reinviteAgent, undeleteUser } from "../service/userAdmin";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";

const AgentList = ({isOpen, setIsOpen, data, isAgentListLoading, onListRefresh }) => {
  const [reinvitingAgentId, setReinvitingAgentId] = useState(null);
  const [deletingAgentId, setDeletingAgentId] = useState(null);
  const [undeletingAgentId, setUndeletingAgentId] = useState(null);
  // The checkbox is unchecked by default, showing only non-deleted users.
  const [showDeleted, setShowDeleted] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const handleReinvite = async (agent) => {
    setReinvitingAgentId(agent.id);
    try {
      await reinviteAgent(agent.email);
    } catch (error) {
      console.error("Failed to reinvite agent:", error);
    } finally {
      setReinvitingAgentId(null);
    }
  };

  const handleDelete = async (agent) => {
    if (window.confirm(`Are you sure you want to delete agent ${agent.agentName}? This is a soft delete.`)) {
      setDeletingAgentId(agent.id);
      try {
        await deleteUser(agent.id, agent.email, CONSTANTS.USER_TYPES.AGENT);
        toast.success(`Agent ${agent.agentName} has been deleted.`);
        // Call the refresh function passed from the parent component.
        if (onListRefresh) onListRefresh();
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
        // Call the refresh function passed from the parent component.
        if (onListRefresh) onListRefresh();
      } catch (error) {
        console.error("Failed to restore agent:", error);
        toast.error(`Failed to restore agent. ${error?.response?.data?.message || ""}`);
      } finally {
        setUndeletingAgentId(null);
      }
    }
  };

  useEffect(() => {
    if (data) {
      const filtered = showDeleted
        ? data
        : data.filter(
            (agent) => agent.status !== CONSTANTS.USER_STATUS.DELETED
          );
      setFilteredData(filtered);
    }
  }, [data, showDeleted]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <button className="open-modal-btn" onClick={() => setIsOpen(true)}>
        Open Modal
      </button> */}

      <DialogContent className="!max-w-5xl w-full"  >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold capitalize !font-poppins" >
            Agents
          </DialogTitle>
        </DialogHeader>

          <div>
              <div className="flex items-center gap-2 justify-end" >
                <Checkbox
                  id="show-deleted-checkbox"
                  className="border-2 size-5 cursor-pointer"
                  checked={showDeleted}
                  onCheckedChange={(value) => setShowDeleted(value)}
                  disabled={isAgentListLoading}
                />
                <Label  htmlFor="show-deleted-checkbox" className="text-sm mb-0" >Show Deleted</Label>
              </div>
            </div>

            <Table className=""  >
                  <TableHeader className="bg-[#F5F0EC]" >
                    <TableRow className="*:!p-2 *:text-sm" >
                      <TableHead className="w-[100px]">Sr. No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Searches This Month</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reinvite</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="" >
                    {
                      isAgentListLoading ?
                      <TableRow >
                        <TableCell colSpan={7} className="font-medium text-center py-10">Loading...</TableCell>
                      </TableRow>
                      :
                      filteredData?.length === 0 ?
                      <TableRow >
                        <TableCell colSpan={7} className="font-medium text-center py-10">No Records found.</TableCell>
                      </TableRow>
                      :
                      filteredData?.map((item, index) => (
                        <TableRow key={item.id} className="*:!p-2 *:text-sm" >
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{item.agentName}</TableCell>
                          <TableCell> {item.lastLogin
                          ? getFormattedDateTime(item.lastLogin)
                          : ""}</TableCell>
                          <TableCell>{item.totalSearches}</TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>
                           <Button
                              size="sm"
                              className={`text-sm`}
                              disabled={item.status !== "UNCONFIRMED" || reinvitingAgentId}
                              onClick={() => handleReinvite(item)}
                            >
                              {reinvitingAgentId === item.id
                                ? "Sending..."
                                : "Reinvite"}
                          </Button>
                          </TableCell>
                          <TableCell>
                                {/* <Button variant="destructive" size="sm" className="text-sm" >Delete</Button> */}
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
                            disabled={deletingAgentId === item.id || reinvitingAgentId || undeletingAgentId}
                            onClick={() => handleDelete(item)}
                            variant="destructive"
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
       

      </DialogContent>
    </Dialog>
  );
};

export default AgentList;
