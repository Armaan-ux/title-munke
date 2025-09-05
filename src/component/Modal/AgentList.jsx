import React, { useState } from "react";
import { getFormattedDateTime } from "../../utils";
// import { reinviteAgent } from "../service/agent";
import { reinviteAgent } from "../service/userAdmin";
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

const AgentList = ({isOpen, setIsOpen, data, isAgentListLoading }) => {
  const [reinvitingAgentId, setReinvitingAgentId] = useState(null);

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

            <Table className=""  >
                  <TableHeader className="bg-[#F5F0EC]" >
                    <TableRow>
                      <TableHead className="w-[100px]">Sr. No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Total Searches This Month</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reinvite</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      isAgentListLoading ?
                      <TableRow >
                        <TableCell colSpan={6} className="font-medium text-center py-10">Loading...</TableCell>
                      </TableRow>
                      :
                      data?.length === 0 ?
                      <TableRow >
                        <TableCell colSpan={6} className="font-medium text-center py-10">No Records found.</TableCell>
                      </TableRow>
                      :
                      data?.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{item.agentName}</TableCell>
                          <TableCell> {item.lastLogin
                          ? getFormattedDateTime(item.lastLogin)
                          : ""}</TableCell>
                          <TableCell>{item.totalSearches}</TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>
                           <Button
                              className={``}
                              disabled={item.status !== "UNCONFIRMED" || reinvitingAgentId}
                              onClick={() => handleReinvite(item)}
                            >
                              {reinvitingAgentId === item.id
                                ? "Sending..."
                                : "Reinvite"}
                          </Button>
                          </TableCell>

                        </TableRow> 
                      ))
                    }
    
                  </TableBody>
                </Table>

          {/* <div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>last Login</th>
                  <th>Total Searches This Month</th>
                  <th>Status</th>
                  <th>Reinvite</th>
                </tr>
              </thead>
              <tbody>
                {isAgentListLoading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      Loading Agents....
                    </td>
                  </tr>
                ) : data?.length ? (
                  data?.map((row) => (
                    <tr key={row.id}>
                      <td>{row.agentName}</td>
                      <td>
                        {row.lastLogin
                          ? getFormattedDateTime(row.lastLogin)
                          : ""}
                      </td>
                      <td>{row.totalSearches}</td>
                      <td>{row.status}</td>
                      <td>
                        <button
                          className={`reinvite-btn ${
                            reinvitingAgentId === row.id ? "reinviting" : ""
                          }`}
                          disabled={
                            row.status !== "UNCONFIRMED" || reinvitingAgentId
                          }
                          onClick={() => handleReinvite(row)}
                        >
                          {reinvitingAgentId === row.id
                            ? "Sending..."
                            : "Reinvite"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No records found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> */}
       

      </DialogContent>
    </Dialog>
  );
};

export default AgentList;
