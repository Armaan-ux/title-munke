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
import { Badge } from "../ui/badge";
import { useUserIdType } from "@/hooks/useUserIdType";
import { useQuery } from "@tanstack/react-query";
import { listAuditLogsByUserId } from "../service/userAdmin";
import { CenterLoader } from "../common/Loader";

import { queryKeys } from "@/utils";

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

  const {userId} = useUserIdType();
  const {data: auditLogs, isPending: isLogsPending} = useQuery({
    queryKey: [queryKeys.listAuditLogsByUserId],
    queryFn: () => listAuditLogsByUserId(userId),
    skip: !userId
  })
  const logs = auditLogs?.data?.items || []


    return (
       <div className="bg-[#F5F0EC] rounded-lg p-7 my-4 text-secondary">
      
        <div className="bg-white !p-4 rounded-xl" >

            <Table className=""  >
              <TableHeader className="bg-[#F5F0EC]" >
                <TableRow>
                  <TableHead className="w-[100px]">Sr. No.</TableHead>
                  {/* <TableHead>Action Performed</TableHead> */}
                  <TableHead>Details</TableHead>
                  <TableHead>Date & Time</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  isLogsPending ?
                  <TableRow >
                    <TableCell colSpan={5} className="font-medium text-center py-10"><CenterLoader /></TableCell>
                  </TableRow>
                  :
                  logs?.length === 0 ?
                  <TableRow >
                    <TableCell colSpan={5} className="font-medium text-center py-10">No Records found.</TableCell>
                  </TableRow>
                  :
                  logs?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      {/* <TableCell>{item.action}</TableCell> */}
                      <TableCell className="whitespace-pre-wrap" >
                        {(() => {
                          try {
                            const parsed = JSON.parse(item.detail);
                            return typeof parsed === "object" && parsed !== null
                              ? Object.values(parsed).join(", ")
                              : item.detail;
                          } catch {
                            return item.detail;
                          }
                        })()}
                      </TableCell>
                      <TableCell>{getFormattedDateTime(item?.createdAt)}</TableCell>
                      {/* <TableCell>{item.status}</TableCell> */}
                      {/* <TableCell>
                          <Badge  className={`!text-sm ${item?.status === "Success" || item?.status === "Completed"
                            ? "bg-[#E9F3E9] text-[#1E8221]" :
                            item?.status === "Updated" ?
                            "bg-[#eef9ff] text-[#2494C7]"
                            : "bg-[#FFF3D9] text-[#A2781E]"} text-[13px] font-medium px-3 py-1 rounded-full`}>
                          {item?.status}
                        </Badge>
                      </TableCell> */}
                    </TableRow> 
                  ))
                }

              </TableBody>
            </Table>
          </div>
     
    </div>
    )
}