import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFormattedDateTime } from "@/utils";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns-tz";

 const sortedBrokers = [
    {
      id: 1,
      address: "Broker A",
      createdAt: "2024-06-10T14:30:00Z",
      status: "Active",
      name: "brokerA",
      downloadLink: "#",
      agent: "5",
      search: "11",
      business: "$2200",
      lastActivity: "2024-06-10 14:30",
    },
    {
      id: 2,
      address: "Broker B",
      createdAt: "2024-06-09T10:15:00Z",
      status: "Inactive",
      name: "brokerB",
      downloadLink: "#",
      agent: "6",
      search: "112",
      business: "$2500",
      lastActivity: "2024-06-10 14:30",
    },
    {
      id: 3,
      address: "Broker C",
      createdAt: "2024-06-08T09:00:00Z",
      status: "Active",
      name: "brokerC",
      downloadLink: "#",
      agent: "10",
      search: "121",
      business: "$200",
      lastActivity: "2024-06-10 14:30",
    },
  ];


export default function BrokerBusinessTable(){
    return(
        <div>
            <Table className="w-full">
              <TableHeader className="bg-[#F5F0EC] w-full">
                <TableRow className="w-full">
                  <TableHead >Sr. No.</TableHead>
                  <TableHead>
                    Broker Name
                    {/* <p className="flex items-center gap-2">
                      Broker Name<span>{getSortArrow("address")}</span>
                    </p> */}
                  </TableHead>
                  <TableHead className="text-center">
                    Agent
                    {/* <p className="flex items-center justify-center gap-2">
                      Agent <span>{getSortArrow("createdAt")}</span>
                    </p> */}
                  </TableHead>
                  <TableHead className="text-center">
                    Search Count
                    {/* <p className="flex items-center justify-center gap-2">
                      Search Count <span>{getSortArrow("status")}</span>
                    </p> */}
                  </TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-center" >Business</TableHead>
                  <TableHead className="text-center" >Account Created</TableHead>
                  <TableHead>Action</TableHead>
                  {/* <TableHead></TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBrokers?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="font-medium text-center py-10"
                    >
                      No Records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedBrokers?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-center" >{item.agent}</TableCell>
                      <TableCell className="text-center" >{item.search}</TableCell>
                      <TableCell>
                        {getFormattedDateTime(item?.lastActivity)}
                      </TableCell>
                      <TableCell className="text-center" >{item.business}</TableCell>
                      <TableCell className="text-center" >
                        {/* {getFormattedDateTime(item?.createdAt)} */}
                        {format(item?.createdAt, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {" "}
                        <div className="flex items-center gap-2 flex-row">
                          <Link to="/admin/broker-details/123" >
                          <Button
                            size="icon"
                            className="text-md"
                            variant="ghost"
                            >
                            <Eye />
                          </Button>
                            </Link>
                        </div>
                      </TableCell>
                      {/* <TableCell className="text-right"></TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </div>
    )
}