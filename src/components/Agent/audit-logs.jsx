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

const dummyData = [
  {
    id: 1,
    action: "Login",
    status: "In Progress",
    createdAt: "2023-03-01T00:00:00.000Z",
    details: "Agent logged in successfully"
  },
  {
    id: 2,
    action: "Searched Performed",
    status: "Success",
    createdAt: "2023-03-01T00:00:00.000Z",
    details: "Changed Password"
  },
  {
    id: 3,
    action: "Logout",
    status: "Updated",
    createdAt: "2023-03-01T00:00:00.000Z",
    details: "Agent logged in successfully"
  },
];

export default function AuditLogs() {
    return (
       <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      
        <div className="bg-white !p-4 rounded-xl" >

            <Table className=""  >
              <TableHeader className="bg-[#F5F0EC]" >
                <TableRow>
                  <TableHead className="w-[100px]">Sr. No.</TableHead>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Action Performed</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  dummyData?.length === 0 ?
                  <TableRow >
                    <TableCell colSpan={5} className="font-medium text-center py-10">No Records found.</TableCell>
                  </TableRow>
                  :
                  dummyData?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{getFormattedDateTime(item?.createdAt)}</TableCell>
                      <TableCell>{item.action}</TableCell>
                      <TableCell>{item.details}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow> 
                  ))
                }

              </TableBody>
            </Table>
          </div>
     
    </div>
    )
}