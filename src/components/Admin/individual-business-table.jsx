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

  const sortedIndividual = [
    { id: 1, name: "John Doe", searchProperty: "5", business: "$200" },
    { id: 2, name: "Jane Smith", searchProperty: "3", business: "$150" },
    { id: 3, name: "Mike Johnson", searchProperty: "8", business: "$300" },
  ];

export default function IndividualBusinessTable(){
    return(
        <div>
              <Table className="">
              <TableHeader className="bg-[#F5F0EC]">
                <TableRow>
                  <TableHead>Sr. No.</TableHead>
                  <TableHead>
                    Name
                    {/* <p className="flex items-center gap-2">
                      Name<span>{getSortArrow("address")}</span>
                    </p> */}
                  </TableHead>
                  <TableHead className="text-center">
                    Property Search
                    {/* <p className="flex items-center gap-2">
                      Property Search <span>{getSortArrow("createdAt")}</span>
                    </p> */}
                  </TableHead>

                  <TableHead className="text-center" >Business</TableHead>
                  <TableHead className="text-center" > Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedIndividual?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="font-medium text-center py-10"
                    >
                      No Records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedIndividual?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.name || "John"}</TableCell>
                      <TableCell className="text-center" >{item.searchProperty || "2"}</TableCell>
                      <TableCell className="text-center" >{item.business || "$150"}</TableCell>
                      <TableCell className="text-center" >
                        <Link to="/admin/property-search/123" >
                          <Button
                            size="icon"
                            className="text-md"
                            variant="ghost"
                            >
                            <Eye />
                          </Button>
                        </Link>

                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </div>
    )
}