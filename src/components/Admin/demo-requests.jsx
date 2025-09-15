import {
  getFormattedDateTime,
} from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Repeat2 } from "lucide-react";

const dummyData = [
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

export default function DemoRequests() {
    return (
        <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">

            <div className="space-x-3 mb-4" >
                <button 
                    className="bg-tertiary text-white rounded-full px-10 py-3"
                 >Pending
                </button>
                <button
                    className="bg-white hover:bg-coffee-bg-foreground transition-all cursor-pointer text-primary rounded-full px-10 py-3"
                >Contacted
                </button>
            </div>
      
        <div className="bg-white !p-4 rounded-xl" >

            <Table className=""  >
              <TableHeader className="bg-[#F5F0EC]" >
                <TableRow>
                  <TableHead className="w-[100px]">Sr. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Team Stength</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  dummyData?.length === 0 ?
                  <TableRow >
                    <TableCell colSpan={9} className="font-medium text-center py-10">No Records found.</TableCell>
                  </TableRow>
                  :
                  dummyData?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.teamStrength}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell><Repeat2 className="mx-auto" /></TableCell>
                    </TableRow> 
                  ))
                }

              </TableBody>
            </Table>
          </div>
     
    </div>
    )
}