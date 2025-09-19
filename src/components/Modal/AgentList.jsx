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
} from "@/components/ui/alert-dialog"

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

      <DialogContent className="!max-w-5xl w-full max-h-[90vh] flex flex-col"  >
        <DialogHeader className="flex flex-row justify-between h-fit" >
          <DialogTitle className="text-lg font-semibold capitalize !font-poppins" >
            Agents
          </DialogTitle>
            <div className="flex items-center gap-2 justify-end mr-10" >
              <Checkbox
                id="show-deleted-checkbox"
                className="border-2 size-5 cursor-pointer"
                checked={showDeleted}
                onCheckedChange={(value) => setShowDeleted(value)}
                disabled={isAgentListLoading}
              />
              <Label  htmlFor="show-deleted-checkbox" className="text-sm mb-0" >Show Deleted</Label>
            </div>
        </DialogHeader>


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
                      <TableCell colSpan={7} className="font-medium text-center py-10 text-muted-foreground">Loading...</TableCell>
                    </TableRow>
                    :
                    filteredData?.length === 0 ?
                    <TableRow >
                      <TableCell colSpan={7} className="font-medium text-center py-10 text-muted-foreground">No Records found.</TableCell>
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
                          <AlertDialog>
                            <AlertDialogTrigger disabled={item.status !== "UNCONFIRMED" || reinvitingAgentId} >
                              <Button
                                  size="sm"
                                  className={`text-sm`}
                                  disabled={item.status !== "UNCONFIRMED" || reinvitingAgentId}
                                  // onClick={() => handleReinvite(item)}
                                >
                                  Reinvite
                                  {/* {reinvitingAgentId === item.id
                                    ? "Sending..."
                                    : "Reinvite"} */}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="!font-poppins font-medium" >Are you absolutely sure?</AlertDialogTitle>
                                {/* <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your account
                                  and remove your data from our servers.
                                </AlertDialogDescription> */}
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild onClick={() => handleReinvite(item)} variant="secondary"  >
                                  <Button>

                                  {reinvitingAgentId === item.id
                                    ? "Sending..."
                                    : "Continue"}
                                    </Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
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
