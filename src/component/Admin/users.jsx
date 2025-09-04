import { API } from "aws-amplify";
import { useState, useEffect } from "react";
import { listAuditLogs } from "@/graphql/queries";
// import "./index.css";
import { useUser } from "@/context/usercontext";
import { FETCH_LIMIT, getFormattedDateTime } from "@/utils";
import { fetchAgentsOfBroker } from "@/component/service/broker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";

const userTypes = [
    {
        name: "Admin",
        id: "admin" 
    },
    {
        name: "Broker",
        id: "broker"
    },
    {
        name: "Agent",
        id: "agent" 
    }
]

const dummyUsers = [
    {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        createdAt: "2023-03-01T00:00:00.000Z",
        type: "Demo Request",
        teamStrength: "High",
        description: "Interested in demo",
        status: "Pending"
    },
    {
        id: 2,
        name: "Jane Doe",
        email: "janedoe@example.com",
        createdAt: "2023-03-01T00:00:00.000Z",
        type: "Demo Request",
        teamStrength: "Medium",
        description: "Interested in demo",
        status: "Approved"
    },
    {
        id: 3,
        name: "Bob Smith",
        email: "bobsmith@example.com",
        createdAt: "2023-03-01T00:00:00.000Z",
        type: "Demo Request",
        teamStrength: "Low",
        description: "Interested in demo",
        status: "Rejected"  
    }
];  

export default function Users() {

    const [activeTab, setActiveTab] = useState(userTypes[0]);

    return (
        <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">

<div className="space-x-3 mb-4" >
            {
                userTypes.map((item, index) => (
                        <button 
                            className={` ${activeTab.id === item.id ? "bg-tertiary text-white" : "bg-white hover:bg-coffee-bg-foreground cursor-pointer text-[#7C6055] " } transition-all  rounded-full px-10 py-3 `}
                            onClick={() => setActiveTab(item)}
                         >{item.name}
                        </button>
                ))
            }
            </div>

          
            <div className="bg-white !p-4 rounded-xl" >

                <div className="flex justify-between gap-4 items-center mb-4" >
                    <p>All {activeTab.name}</p>
                    <Button variant="secondary">  <PlusCircle /> Add Users</Button>
                </div>
    
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
                  <TableBody>
                    {
                      dummyUsers?.length === 0 ?
                      <TableRow >
                        <TableCell colSpan={5} className="font-medium text-center py-10">No Records found.</TableCell>
                      </TableRow>
                      :
                      dummyUsers?.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>
                            <div className="space-x-1" >
                                <Button variant="ghost" size="icon" ><Pencil /></Button>
                                <Button variant="ghost" size="icon" ><Trash2 /></Button>
                            </div>
                          </TableCell>
                        </TableRow> 
                      ))
                    }
    
                  </TableBody>
                </Table>

                
                {/* {!hasMore && <p>No more data to load.</p>}
                {logs?.length > 0 && hasMore && !loading && (
                    <button className="loadmore" onClick={fetchLogs}>
                        Load More
                    </button>
                )} */}


              </div>
         
        </div>
    )
}